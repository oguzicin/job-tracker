import React from "react";
import { Job } from "../types/Job";
import { Pencil, Trash2 } from "lucide-react";
import ReactDOM from "react-dom";

interface JobBoxProps {
  data: Job;
  onStatusChange?: (id: number, newStatus: string) => void;
  onDelete?: (id: number) => void;
  onUpdate?: (updatedJob: Job) => void;
}

const JobBox: React.FC<JobBoxProps> = ({
  data,
  onStatusChange,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [editData, setEditData] = React.useState<Job>(data);

  // data prop değiştiğinde editData senkronize edilir
  React.useEffect(() => {
    setEditData(data);
  }, [data]);

  const statusBgMap: Record<string, string> = {
    pending: "bg-orange-300",
    interview: "bg-blue-300",
    declined: "bg-red-300",
    offered: "bg-green-300",
  };

  const handleSave = () => {
    onUpdate?.(editData);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-row w-full gap-2 custom-xs:gap-0 justify-between relative items-center">
      {isDeleting &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 gap-2 rounded-lg shadow-2xl text-center">
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this job?</p>
              <div className="gap-2 flex flex-col mt-2">
                <button
                  className="rounded-lg p-1 text-white bg-red-500"
                  onClick={() => {
                    onDelete?.(data.id!);
                    setIsDeleting(false);
                  }}
                >
                  Confirm
                </button>
                <button
                  className="rounded-lg p-1 text-white bg-gray-500"
                  onClick={() => setIsDeleting(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      <div
        className={`flex-1 min-w-0 rounded-md flex flex-row items-center px-1 sm:px-2
          h-[36px] custom-xs:h-[45px] sm:h-[40px] md:h-[45px]
          ${isEditing ? "bg-blue-100" : "bg-white/40"}`}
      >
        {isEditing ? (
          <div className="flex flex-row items-center gap-1 w-full">
            <input
              className="min-w-0 flex-1 border rounded px-1 text-xs sm:text-sm"
              value={editData.company}
              onChange={(e) =>
                setEditData({ ...editData, company: e.target.value })
              }
            />
            <input
              className="min-w-0 flex-1 border rounded px-1 text-xs sm:text-sm"
              value={editData.position}
              onChange={(e) =>
                setEditData({ ...editData, position: e.target.value })
              }
            />
            <input
              className="min-w-0 flex-1 border rounded px-1 text-xs sm:text-sm"
              value={editData.jobType}
              onChange={(e) =>
                setEditData({ ...editData, jobType: e.target.value })
              }
            />
            <input
              className="min-w-0 flex-1 border rounded px-1 text-xs sm:text-sm"
              value={editData.jobLocation}
              onChange={(e) =>
                setEditData({ ...editData, jobLocation: e.target.value })
              }
            />
            <input
              className="min-w-0 flex-1 border rounded px-1 text-xs sm:text-sm"
              type="date"
              value={editData.dateApplied}
              onChange={(e) =>
                setEditData({ ...editData, dateApplied: e.target.value })
              }
            />
            <button
              onClick={handleSave}
              className="shrink-0 bg-green-500 text-white px-2 py-0.5 rounded-md text-xs"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="shrink-0 bg-gray-300 px-2 py-0.5 rounded-md text-xs"
            >
              X
            </button>
          </div>
        ) : (
          <div className="flex flex-row items-center justify-evenly w-full gap-1">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate text-[10px] xs:text-xs sm:text-sm md:text-base">
                {data.company}
              </h3>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-blue-600 truncate text-[9px] xs:text-[10px] sm:text-xs md:text-sm">
                {data.position}
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[9px] xs:text-[10px] sm:text-xs md:text-sm">
                {data.jobType}
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <span className="truncate block text-[9px] xs:text-[10px] sm:text-xs md:text-sm">
                {data.jobLocation}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="truncate block text-[9px] xs:text-[10px] sm:text-xs md:text-sm">
                {data.dateApplied
                  ? new Date(data.dateApplied).toLocaleDateString("tr-TR")
                  : "-"}
              </span>
            </div>
            <div className="shrink-0">
              <select
                value={data.status}
                onChange={(e) => onStatusChange?.(data.id!, e.target.value)}
                className={`focus:outline-none text-white rounded-md transition-colors duration-200 justify-center flex font-medium
                  text-[8px] custom-xs:h-[24px] custom-xs:w-[55px] custom-xs:text-[8px] sm:text-xs md:text-sm
                  px-1 sm:px-2 py-0.5 sm:py-1
                  ${statusBgMap[data.status]}`}
              >
                <option value="pending" className="bg-orange-300 text-white">
                  Pending
                </option>
                <option value="interview" className="bg-blue-300 text-white">
                  Interview
                </option>
                <option value="declined" className="bg-red-300 text-white">
                  Declined
                </option>
                <option value="offered" className="bg-green-300 text-white">
                  Offered
                </option>
              </select>
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex flex-row h-full custom-xm:flex-col shrink-0 gap-1 justify-center px-0.5">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-400 hover:bg-yellow-300 text-white opacity-55 rounded-md flex justify-center items-center
              w-6 h-10 custom-xm:h-5 custom-xm:w-7"
          >
            <Pencil className="w-2 h-2 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
          </button>
          <button
            onClick={() => setIsDeleting(true)}
            className="bg-gray-400 hover:bg-red-300 text-white opacity-55 rounded-md flex justify-center items-center
              w-6 h-10 custom-xm:h-5 custom-xm:w-7"
          >
            <Trash2 className="w-2 h-2 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobBox;