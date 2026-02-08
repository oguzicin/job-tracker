import React from "react";
import { Job } from "../types/Job";
import { Check, Pencil, Trash2 } from "lucide-react";

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
    <div className="flex flex-row w-full justify-between gap-2 relative">
      {isDeleting && (
        <div className="fixed inset-0 z-[100]  flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 gap-2 rounded-lg shadow-2xl text-center">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this job?</p>
            <div className="gap-2 flex flex-col">
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
        </div>
      )}

      <div
        className={`w-full h-[45px] rounded-md flex flex-row px-2 justify-between items-center ${isEditing ? "bg-blue-100" : "bg-white/40"}`}
      >
        <div className="w-full flex flex-row justify-evenly items-center ">
          {isEditing ? (
            <>
              <input
                className="w-24 border rounded px-1"
                value={editData.company}
                onChange={(e) =>
                  setEditData({ ...editData, company: e.target.value })
                }
              />
              <input
                className="w-24 border rounded px-1"
                value={editData.position}
                onChange={(e) =>
                  setEditData({ ...editData, position: e.target.value })
                }
              />
              <input
                className="w-24 border rounded px-1"
                value={editData.jobType}
                onChange={(e) =>
                  setEditData({ ...editData, jobType: e.target.value })
                }
              />
              <input
                className="w-24 border rounded px-1"
                value={editData.jobLocation}
                onChange={(e) =>
                  setEditData({ ...editData, jobLocation: e.target.value })
                }
              />
              <input
                className="w-24 border rounded px-1"
                type="date"
                value={editData.dateApplied}
                onChange={(e) =>
                  setEditData({ ...editData, dateApplied: e.target.value })
                }
              />
              <div className="w-28"></div>{" "}
              {}
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-3 py-1 rounded-md text-xs"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 px-3 py-1 rounded-md text-xs"
              >
                X
              </button>
            </>
          ) : (
            <>
              {" "}
              <div className="w-28 flex flex-row">
                <h3 className="text-base font-bold">{data.company}</h3>
              </div>
              <div className="w-28 flex flex-row">
                <p className="text-sm text-blue-600">{data.position}</p>
              </div>
              <div className="w-28 flex flex-row">
                <p className="text-sm ">{data.jobType}</p>
              </div>
              <div className="w-28">
                <span className="text-sm  rounded-md">{data.jobLocation}</span>
              </div>
              <div className="w-28 align-middle items-center flex flex-row">
                <span className="rounded-md">
                  {data.dateApplied
                    ? new Date(data.dateApplied).toLocaleDateString("tr-TR")
                    : "-"}
                </span>
              </div>
              <div className="hidden w-28 align-middle items-center /*flex*/">
                <span className="text-sm  rounded-md">{data.description}</span>
              </div>
              <select
                value={data.status}
                onChange={(e) => onStatusChange?.(data.id!, e.target.value)}
                className={`focus:outline-none text-white rounded-md transition-colors duration-200 font-medium px-2 py-1 ${statusBgMap[data.status]}`}
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
            </>
          )}
        </div>
      </div>
      {!isEditing && (
        <div className="flex flex-row gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm w-6 bg-gray-400 hover:bg-yellow-300 text-white opacity-55 rounded-md flex justify-center items-center align-middle"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setIsDeleting(true)}
            className="text-sm w-6 bg-gray-400 hover:bg-red-300 text-white opacity-55 rounded-md flex justify-center items-center align-middle"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobBox;
