import { useState } from "react";
import { UploadCloud, File, Loader2, Bot, LogOut, FileText, CheckCircle, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Sidebar({
  username,
  file,
  isUploading,
  uploadStatus,
  userFiles,
  activeFile,
  onFileChange,
  onUpload,
  onSelectFile,
  onDeleteFile,
  onLogout,
  isOpenMobile,
  onCloseMobile,
  filesLoading
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const navigate=useNavigate();
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      onFileChange({ target: { files: [droppedFile] } });
    }
  };

  return (
    <aside className={`w-[280px] h-screen shrink-0 bg-bg-secondary border-r border-border-color flex flex-col p-[24px_20px] gap-4 relative z-1000 transition-all duration-250 ease-in-out max-lg:fixed max-lg:top-0 max-lg:bottom-0 max-lg:left-0 max-lg:w-[290px] max-lg:shadow-lg max-lg:-translate-x-full ${
      isOpenMobile ? "max-lg:translate-x-0" : ""
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 cursor-pointer" onClick={()=>navigate("/")}>
          <div className=" w-8 h-8 rounded-xs bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white shadow-[0_0_12px_rgba(79,70,229,0.2)] shrink-0">
            <Bot size={18} />
          </div>
          <span className="text-[1.15rem] font-extrabold text-text-primary tracking-[-0.5px] cursor-pointer" >Insight AI</span>
        </div>
        <button 
          className="hidden max-lg:flex items-center justify-center bg-transparent border-none text-text-secondary cursor-pointer p-1 rounded-full transition-all duration-120 hover:bg-white/5 hover:text-text-primary" 
          onClick={onCloseMobile} 
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex items-center gap-3 bg-white/2 border border-border-color rounded-md p-[12px_14px] mb-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-blue to-primary flex items-center justify-center font-extrabold text-[0.95rem] text-white shrink-0 shadow-sm">
          {username.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col overflow-hidden">
          <div className="text-sm font-semibold text-text-primary truncate">{username}</div>
          {/* <div className="text-[0.72rem] font-medium text-text-secondary opacity-70">Pro User</div> */}
        </div>
      </div>

      <div className="text-[0.72rem] font-extrabold uppercase tracking-wider text-text-muted px-1 mt-2">
        Upload New
      </div>

      <label 
        className={`group flex items-center gap-3 bg-bg-input border border-dashed border-border-color rounded-md p-3.5 cursor-pointer transition-all duration-250 ease-in-out hover:border-primary hover:bg-primary/3 ${
          isDragActive ? "border-accent-blue bg-accent-blue/5" : ""
        }`} 
        htmlFor="file-upload"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="w-9 h-9 rounded-xs bg-primary/10 flex items-center justify-center text-accent-blue shrink-0 transition-all duration-120 group-hover:bg-primary-light group-hover:text-text-primary">
          {file ? <File size={20} /> : <UploadCloud size={20} />}
        </div>
        <div className="flex flex-col gap-[3px] overflow-hidden flex-1">
          <span className="text-[0.82rem] font-semibold text-text-primary truncate">
            {file ? file.name : "Upload File"}
          </span>
          <small className="text-[0.7rem] text-text-secondary">
            {file ? "Ready to process" : "Drag & drop or click"}
          </small>
        </div>
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".pdf,.docx,.pptx,.txt,.csv,.xlsx,.png,.jpg,.jpeg,.webp"
        onChange={onFileChange}
        style={{ display: "none" }}
      />

      <button 
        className="flex items-center justify-center gap-2 p-3 rounded-xs bg-gradient-to-r from-primary to-accent-blue text-white cursor-pointer transition-all duration-250 ease-in-out shadow-[0_4px_12px_rgba(79,70,229,0.15)]" 
        onClick={onUpload} 
        disabled={!file || isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="animate-spin-custom" size={16} /> 
            Processing…
          </>
        ) : (
          "Process Document"
        )}
      </button>

      {uploadStatus.message && (
        <div className={`p-[10px_14px] rounded-xs text-[0.78rem] font-medium text-center mt-1 border-l-3 leading-normal border ${
          uploadStatus.type === "success"
            ? "bg-success-light text-success-text border-success-border border-l-success"
            : "bg-error-light text-error-text border-error-border border-l-error"
        }`}>
          {uploadStatus.message}
        </div>
      )}

      <div className="text-[0.72rem] font-extrabold uppercase tracking-wider text-text-muted px-1 mt-2">
        Your Documents
      </div>

      <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 max-h-[350px] pr-1">
        {filesLoading ? (
          <>
            <div className="flex items-center gap-2.5 p-[10px_12px] rounded-sm border border-transparent h-[38px] animate-shimmer" />
            <div className="flex items-center gap-2.5 p-[10px_12px] rounded-sm border border-transparent h-[38px] animate-shimmer opacity-70" />
            <div className="flex items-center gap-2.5 p-[10px_12px] rounded-sm border border-transparent h-[38px] animate-shimmer opacity-40" />
          </>
        ) : userFiles.length === 0 ? (
          <div className="text-[0.8rem] text-text-muted text-center p-[24px_12px] bg-white/[0.01] border border-dashed border-border-color rounded-sm">
            No files uploaded yet
          </div>
        ) : (
          userFiles.map((f) => (
            <div
              key={f.key}
              className={`group flex items-center justify-between p-[10px_12px] rounded-sm cursor-pointer text-[0.82rem] border transition-all duration-120 hover:bg-white/3 hover:text-text-primary ${
                activeFile === f.filename 
                  ? "bg-primary-light border-primary/25 text-accent-blue font-semibold"
                  : "text-text-secondary border-transparent"
              }`}
              onClick={() => {
                onSelectFile(f.filename);
                if (onCloseMobile) onCloseMobile();
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <FileText size={15} className="shrink-0" />
                <span className="truncate">{f.filename}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {activeFile === f.filename && (
                  <CheckCircle size={14} className="text-accent-blue shrink-0" />
                )}
                <button
                  type="button"
                  className="p-1 rounded-full text-text-secondary hover:text-error-text hover:bg-error-light opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-150 border-none bg-transparent cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Are you sure you want to delete "${f.filename}"?`)) {
                      onDeleteFile(f.filename);
                    }
                  }}
                  title="Delete document"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-border-color">
        <button 
          className="flex items-center gap-2.5 w-full p-[12px_14px] rounded-sm border-none bg-transparent text-text-secondary text-sm font-semibold cursor-pointer transition-all duration-120 font-inherit hover:bg-error-light hover:text-error-text" 
          onClick={onLogout}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
