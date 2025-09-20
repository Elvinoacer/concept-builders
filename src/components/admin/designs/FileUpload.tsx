
"use client";

const FileUpload = () => {
  return (
    <div className="mb-4 md:mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">File Upload</h2>
      <div className="flex flex-col items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-32 md:h-48 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <span className="material-symbols-outlined text-4xl md:text-6xl text-muted-foreground">
              cloud_upload
            </span>
            <p className="mb-2 text-base md:text-lg text-foreground font-bold">
              <span className="font-semibold">Drag and drop files here</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Or click to browse your files
            </p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" />
        </label>
        <button className="flex items-center gap-2 mt-4 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-sm font-bold">
          <span className="material-symbols-outlined">upload_file</span>
          <span className="truncate">Upload Files</span>
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
