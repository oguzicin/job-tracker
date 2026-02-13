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
    <div className="create-job-form w-[60vw] flex flex-row custom-sm:flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      <input
        className="flex-1 min-w-[80px] h-8 custom-xs:h-6 rounded-md focus:outline-none px-1 bg-white/60"
        placeholder="Company"
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
      />
      <input
        className="flex-1 min-w-[80px] h-8 custom-xs:h-6 rounded-md focus:outline-none px-1 bg-white/60"
        placeholder="Position"
        value={formData.position}
        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
      />
      <input
        className="flex-1 min-w-[80px] h-8 custom-xs:h-6 rounded-md focus:outline-none px-1 bg-white/60"
        placeholder="Job Type"
        value={formData.jobType}
        onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
      />
      <input
        className="flex-1 min-w-[80px] h-8 custom-xs:h-6 rounded-md focus:outline-none px-1 bg-white/60"
        placeholder="Job Location"
        value={formData.jobLocation}
        onChange={(e) => setFormData({ ...formData, jobLocation: e.target.value })}
      />

      {/* custom-sm altında w-full ile alt satıra düşer, üstünde normal flex item olarak kalır */}
      <div className="custom-sm:w-full justify-center flex flex-row items-center gap-2">
        <input
          className="flex h-8 custom-xs:h-6 rounded-md focus:outline-none px-1 bg-white/60"
          placeholder="Date Applied"
          type="date"
          value={formData.dateApplied}
          onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
        />
        <button
          className="bg-white/30 hover:bg-green-400 text-white rounded-md shrink-0"
          onClick={handleSubmit}
        >
          <SquarePlus size={32} />
        </button>
      </div>
    </div>
  );
};

export default CreateButton;