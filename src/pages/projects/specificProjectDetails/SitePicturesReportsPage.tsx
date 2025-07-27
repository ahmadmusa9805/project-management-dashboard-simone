import { useNavigate, useParams } from "react-router-dom";

const foldersData = [
  {
    id: "demolitions",
    name: "Demolitions",
  },
  {
    id: "structural-works",
    name: "Structural works",
  },
  {
    id: "internal-works",
    name: "Internal works",
  },
  {
    id: "m-e",
    name: "M/E",
  },
  {
    id: "finishing",
    name: "Finishing",
  },
  {
    id: "report",
    name: "Report",
  },
];

const SitePicturesReportsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const handleFolderClick = (folderId: string) => {
    console.log("Navigating to folder", folderId, "in project", projectId);
    navigate(`/projects/${projectId}/site-pictures-reports/${folderId}`);
  };

  return (
    <div className="self-stretch px-8 py-6 bg-white inline-flex flex-col justify-start items-end gap-8">
      {/* Header */}
      <div className="self-stretch inline-flex justify-start items-end gap-8">
        <div className="flex justify-start items-center gap-1">
          <div className="flex justify-center items-center gap-2.5">
            <div className="text-gray-950 text-2xl font-medium leading-loose tracking-tight">
              Site Pictures & Reports
            </div>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="self-stretch flex-1 inline-flex justify-start items-start gap-3 flex-wrap content-start">
        {foldersData.map((folder) => (
          <div
            key={folder.id}
            onClick={() => handleFolderClick(folder.id)}
            className="w-80 h-28 px-3 py-8 bg-zinc-100 rounded-[3px] flex justify-start items-center gap-4 cursor-pointer"
          >
            <div className="flex-1 flex flex-col justify-center items-start">
              <div className="w-full max-w-32 text-gray-950 text-lg font-medium leading-normal tracking-tight">
                {folder.name}
              </div>
            </div>
            <div className="w-6 rotate-180 flex justify-start items-center">
              <div className="flex-1 h-6 relative overflow-hidden">
                <div className="w-4 h-3 absolute left-[3px] top-[11px] bg-neutral-500" />
                <div className="w-2.5 h-1.5 absolute left-[7px] top-[1px] bg-neutral-500" />
                <div className="w-0.5 h-3.5 absolute left-[11px] top-[1px] bg-neutral-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SitePicturesReportsPage;
