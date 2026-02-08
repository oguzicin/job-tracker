import React from "react";

const Status: React.FC = ({ currentStatus, onStatusChange }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const statusBgMap: Record<string, string> = {
    pending: "bg-orange-300",
    interview: "bg-blue-300",
    declined: "bg-red-300",
    offered: "bg-green-300",
  };

  const options = ["pending", "interview", "declined", "offered"];

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-2 py-1 border-2 border-gray-300 rounded-md text-left text-xs font-semibold focus:outline-none ${statusBgMap[currentStatus]}`}
      >
        {currentStatus.toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onStatusChange(option);
                setIsOpen(false);
              }}

              className="px-2 py-1 text-xs cursor-pointer bg-white hover:bg-gray-100 transition-colors"
            >
              {option.toUpperCase()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export  default Status;
