import React, { useState } from "react";
import { Job } from "../types/Job";
import { SquarePlus } from "lucide-react";
import { toast } from "react-toastify";

interface CreateButtonProps {
  onJobCreated: (newJob: Job) => void;
}

const CreateButton: React.FC<CreateButtonProps> = ({ onJobCreated }) => {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "pending",
    jobType: "",
    jobLocation: "",
    dateApplied: new Date().toISOString().split("T")[0],
    description: "",
  });

  const handleSubmit = () => {
    if (!formData.company || !formData.position) {
      toast.error("Please fill in required fields.");
      return;
    }



    onJobCreated(formData as Job);

    setFormData({
      company: "",
      position: "",
      status: "",
      jobType: "",
      jobLocation: "",
      dateApplied: "",
      description: "",
    });
  };

  return (
    <div className="create-job-form w-[60vw] flex flex-row items-center gap-2 text-sm">
      <input
        className="w-full h-8 rounded-md focus:outline-none px-1 bg-white/60"
        placeholder="Company"
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
      />
      <input
        className="w-full h-8 rounded-md focus:outline-none px-1 bg-white/60"
        placeholder="Position"
        value={formData.position}
        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
      />
      <input
        className="w-full h-8 rounded-md focus:outline-none px-1 bg-white/60"
        placeholder="Job Type"
        value={formData.jobType}
        onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
      />
      <input
        className="w-full h-8 rounded-md focus:outline-none px-1 bg-white/60"
        placeholder="Job Location"
        value={formData.jobLocation}
        onChange={(e) =>
          setFormData({ ...formData, jobLocation: e.target.value })
        }
      />
      <input
        className="w-full h-8 rounded-md focus:outline-none px-1 bg-white/60 "
        placeholder="Date Applied"
        type="date"
        value={formData.dateApplied}
        onChange={(e) =>
          setFormData({ ...formData, dateApplied: e.target.value })
        }
      />
      <textarea
        className="hidden rw-full h-8 rounded-md p-2 focus:outline-none text-white/60"
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      ></textarea>
      <button
        className="bg-white/30 hover:bg-green-400 text-white rounded-md"
        onClick={handleSubmit}
      >
        <SquarePlus size={32} />
      </button>
    </div>
  );
};

export default CreateButton;
