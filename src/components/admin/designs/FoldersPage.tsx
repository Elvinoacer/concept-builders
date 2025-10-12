import FolderStructure from "./FolderStructure";
import VersionControl from "./VersionControl";

const FoldersPage = ({ folders, loading }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Design Assets</h1>
        <p className="text-muted-foreground mt-2">
          Manage design files, including folder trees, file uploads to
          DigitalOcean Spaces, and version control.
        </p>
      </div>
      <FolderStructure folders={folders} loading={loading} />
      
      <VersionControl />
    </div>
  );
};

export default FoldersPage;
