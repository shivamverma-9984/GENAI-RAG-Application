import uvicorn
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import boto3
import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
import secrets
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import base64

from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, CSVLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from pptx import Presentation
import openpyxl

load_dotenv()

app = FastAPI(title="Chat with PDF using Gemini")

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey")
ALGORITHM = "HS256"

# DynamoDB setup
dynamodb = boto3.resource('dynamodb', region_name=os.getenv("AWS_REGION", "us-east-1"))
USERS_TABLE_NAME = os.getenv("DYNAMODB_TABLE", "ChatBot_User")

def get_users_table():
    return dynamodb.Table(USERS_TABLE_NAME)

# S3 setup
s3 = boto3.client('s3', region_name=os.getenv("AWS_REGION", "us-east-1"))
S3_BUCKET = os.getenv("S3_BUCKET_NAME", "")

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Global store for the vector database (in-memory for demo purposes)
# For production, consider persistent storage like ChromaDB or Postgres pgvector
app.state.vector_store = None
app.state.active_file = None

SUPPORTED_EXTENSIONS = {
    ".pdf", ".docx", ".pptx", ".txt", ".csv", ".xlsx",
    ".png", ".jpg", ".jpeg", ".webp"
}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}

# Set up Gemini clients
# Make sure GOOGLE_API_KEY is set in .env
try:
    # Initialize embeddings
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

    # Initialize LLM
    llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite-preview")
except Exception as e:
    print(f"Error initializing Gemini clients: {e}")
    embeddings = None
    llm = None

class ChatRequest(BaseModel):
    query: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    token: str
    new_password: str

@app.post("/register")
def register(user: RegisterRequest):
    table = get_users_table()

    # Check if email already exists (email is partition key)
    response = table.get_item(Key={'email': user.email})
    if 'Item' in response:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    table.put_item(Item={'email': user.email, 'username': user.username, 'password': hashed_password})
    return {"message": "User registered successfully"}

@app.post("/login")
def login(user: LoginRequest):
    table = get_users_table()
    response = table.get_item(Key={'email': user.email})

    if 'Item' not in response:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    stored_password = response['Item']['password']
    if not bcrypt.checkpw(user.password.encode('utf-8'), stored_password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    username = response['Item']['username']
    token = jwt.encode(
        {"sub": user.email, "exp": datetime.now(timezone.utc) + timedelta(hours=24)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return {"access_token": token, "token_type": "bearer", "username": username}

@app.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    table = get_users_table()
    response = table.get_item(Key={'email': req.email})
    if 'Item' not in response:
        raise HTTPException(status_code=404, detail="Email not registered")
    
    # Generate 6-digit PIN/token
    token = f"{secrets.randbelow(900000) + 100000}"
    # Expire in 15 minutes
    expiry = int((datetime.now(timezone.utc) + timedelta(minutes=15)).timestamp())
    
    table.update_item(
        Key={'email': req.email},
        UpdateExpression="SET reset_token = :token, reset_token_expiry = :expiry",
        ExpressionAttributeValues={
            ':token': token,
            ':expiry': expiry
        }
    )
    # Returning the token in the response simulates sending it to the user's email
    return {"message": "Verification code sent successfully", "token": token}

@app.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    table = get_users_table()
    response = table.get_item(Key={'email': req.email})
    if 'Item' not in response:
        raise HTTPException(status_code=404, detail="Email not registered")
    
    item = response['Item']
    stored_token = item.get('reset_token')
    stored_expiry = item.get('reset_token_expiry')
    
    if not stored_token or stored_token != req.token:
        raise HTTPException(status_code=400, detail="Invalid verification code")
        
    current_time = int(datetime.now(timezone.utc).timestamp())
    if stored_expiry and current_time > int(stored_expiry):
        raise HTTPException(status_code=400, detail="Verification code has expired")
        
    hashed_password = bcrypt.hashpw(req.new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    table.update_item(
        Key={'email': req.email},
        UpdateExpression="SET password = :p REMOVE reset_token, reset_token_expiry",
        ExpressionAttributeValues={
            ':p': hashed_password
        }
    )
    return {"message": "Password reset successfully"}

def process_file_to_vectorstore(tmp_file_path: str, filename: str):
    ext = os.path.splitext(filename)[1].lower()

    if ext in IMAGE_EXTENSIONS:
        # Use Gemini Vision to extract text from image
        with open(tmp_file_path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")
        mime_map = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp"}
        vision_llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite-preview")
        from langchain_core.messages import HumanMessage
        msg = HumanMessage(content=[
            {"type": "text", "text": "Extract and return all text content visible in this image in detail."},
            {"type": "image_url", "image_url": {"url": f"data:{mime_map[ext]};base64,{image_data}"}}
        ])
        extracted_text = vision_llm.invoke([msg]).content
        docs = [Document(page_content=extracted_text, metadata={"source": filename})]
    elif ext == ".pdf":
        docs = PyPDFLoader(tmp_file_path).load()
    elif ext == ".docx":
        docs = Docx2txtLoader(tmp_file_path).load()
    elif ext == ".pptx":
        prs = Presentation(tmp_file_path)
        text_parts = []
        for slide in prs.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text") and shape.text.strip():
                    text_parts.append(shape.text.strip())
        docs = [Document(page_content="\n".join(text_parts), metadata={"source": filename})]
    elif ext == ".txt":
        with open(tmp_file_path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
        docs = [Document(page_content=text, metadata={"source": filename})]
    elif ext == ".csv":
        docs = CSVLoader(tmp_file_path).load()
    elif ext == ".xlsx":
        wb = openpyxl.load_workbook(tmp_file_path, data_only=True)
        text_parts = []
        for sheet in wb.worksheets:
            for row in sheet.iter_rows(values_only=True):
                row_text = "\t".join(str(c) for c in row if c is not None)
                if row_text.strip():
                    text_parts.append(row_text)
        docs = [Document(page_content="\n".join(text_parts), metadata={"source": filename})]
    else:
        raise ValueError(f"Unsupported file type: {ext}")

    splits = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200).split_documents(docs)
    app.state.vector_store = FAISS.from_documents(splits, embeddings)
    return len(splits)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed: {', '.join(SUPPORTED_EXTENSIONS)}")
    if embeddings is None or llm is None:
        raise HTTPException(status_code=500, detail="Gemini clients not initialized properly.")
    if not S3_BUCKET:
        raise HTTPException(status_code=500, detail="S3 bucket not configured.")
    try:
        content = await file.read()
        s3_key = f"{current_user}/{file.filename}"
        s3.put_object(Bucket=S3_BUCKET, Key=s3_key, Body=content)

        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp_file:
            tmp_file.write(content)
            tmp_file_path = tmp_file.name

        chunks = process_file_to_vectorstore(tmp_file_path, file.filename)
        os.remove(tmp_file_path)
        app.state.active_file = file.filename

        return {"message": "File uploaded and processed successfully", "chunks": chunks, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/files")
def list_files(current_user: str = Depends(get_current_user)):
    if not S3_BUCKET:
        raise HTTPException(status_code=500, detail="S3 bucket not configured.")
    try:
        prefix = f"{current_user}/"
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=prefix)
        files = []
        for obj in response.get("Contents", []):
            key = obj["Key"]
            filename = key[len(prefix):]
            if filename:
                files.append({"filename": filename, "key": key, "size": obj["Size"], "last_modified": obj["LastModified"].isoformat()})
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing files: {str(e)}")

class SelectFileRequest(BaseModel):
    filename: str

@app.post("/files/select")
def select_file(req: SelectFileRequest, current_user: str = Depends(get_current_user)):
    if embeddings is None:
        raise HTTPException(status_code=500, detail="Gemini clients not initialized properly.")
    if not S3_BUCKET:
        raise HTTPException(status_code=500, detail="S3 bucket not configured.")
    try:
        ext = os.path.splitext(req.filename)[1].lower()
        s3_key = f"{current_user}/{req.filename}"
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp_file:
            s3.download_fileobj(S3_BUCKET, s3_key, tmp_file)
            tmp_file_path = tmp_file.name
        chunks = process_file_to_vectorstore(tmp_file_path, req.filename)
        os.remove(tmp_file_path)
        app.state.active_file = req.filename
        return {"message": f"{req.filename} loaded successfully", "chunks": chunks, "filename": req.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading file: {str(e)}")

@app.post("/chat")
async def chat_with_pdf(request: ChatRequest, current_user: str = Depends(get_current_user)):
    if app.state.vector_store is None:
        raise HTTPException(status_code=400, detail="Please upload a file first")
    
    if embeddings is None or llm is None:
        raise HTTPException(status_code=500, detail="Gemini clients not initialized properly.")
    try:
        retriever = app.state.vector_store.as_retriever(search_kwargs={"k": 3})
        system_prompt = (
            "You are an assistant for question-answering tasks. "
            "Use the following pieces of retrieved context to answer the question. "
            "If you don't know the answer, say that you don't know. "
            "Use three sentences maximum and keep the answer concise."
            "\n\n"
            "{context}"
        )
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
        ])
        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)
        rag_chain = (
            {"context": retriever | format_docs, "input": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )

        response = rag_chain.invoke(request.query)
        return {"answer": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer: {str(e)}")
    
@app.get("/")
def read_root():
    return {"message": "Welcome to Chat with PDF GenAI API"}



if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)