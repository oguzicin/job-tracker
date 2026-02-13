import React, { useEffect, useState } from "react";
import JobBox from "../components/JobBox";
import CreateButton from "../components/CreateJob";
import { Job } from "../types/Job";
import axios from "axios";
import { UserRound } from "lucide-react";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../contexts/AuthContext";
import { Search, X } from "lucide-react";

type SortOption =
  | "newest"
  | "oldest"
  | "company"
  | "position"
  | "status"
  | "location";

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchItem, setSearchItem] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const API_URL = process.env.REACT_APP_API_URL + "/jobs";
  const token = localStorage.getItem("token");

  useEffect(() => {
const fetchJobs = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: { token: token },
    });
    const normalizedJobs = response.data.map((job: Job) => ({
      ...job,
      status: job.status?.toLowerCase() ?? "pending", // ← buraya
    }));
    setJobs(normalizedJobs);
  } catch (err) {
    console.error("Jobs fetch error:", err);
  } finally {
    setLoading(false);
  }
};

    if (token) {
      fetchJobs();
    }
  }, [token]);

const handleAddNewJob = async (jobData: Job) => {
  try {
    const response = await axios.post(API_URL, jobData, {
      headers: { token: token },
    });
    const newJob = {
      ...response.data,
      status: response.data.status?.toLowerCase() ?? "pending", // ← buraya
    };
    setJobs((prevJobs) => [...prevJobs, newJob]);
  } catch (err) {
    console.error("Add job error:", err);
  }
};

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axios.patch(
        `${API_URL}/${id}`,
        { status: newStatus },
        {
          headers: { token: token },
        },
      );
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === id ? { ...job, status: newStatus } : job,
        ),
      );
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDeleteJob = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { token: token },
      });
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const search = searchItem.toLowerCase();
    return (
      job.company.toLowerCase().includes(search) ||
      job.position.toLowerCase().includes(search) ||
      job.jobLocation.toLowerCase().includes(search) ||
      job.jobType.toLowerCase().includes(search)
    );
  });

  const getSortedJobs = (jobsList: Job[]) => {
    const sorted = [...jobsList];

    switch (sortBy) {
      case "newest":
        return sorted.reverse();
      case "oldest":
        return sorted;
      case "company":
        return sorted.sort((a, b) => a.company.localeCompare(b.company));
      case "position":
        return sorted.sort((a, b) => a.position.localeCompare(b.position));
      case "status":
        const statusOrder = { pending: 1, interview: 2, declined: 3 };
        return sorted.sort((a, b) => {
          const orderA =
            statusOrder[a.status as keyof typeof statusOrder] || 999;
          const orderB =
            statusOrder[b.status as keyof typeof statusOrder] || 999;
          return orderA - orderB;
        });
      case "location":
        return sorted.sort((a, b) =>
          a.jobLocation.localeCompare(b.jobLocation),
        );
      default:
        return sorted.reverse();
    }
  };

  const displayJobs = getSortedJobs(filteredJobs);

  if (authLoading) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center bg-indigo-50/50">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-gradient-to-br from-blue-300/95 via-purple-300 to-red-300 ">
      <div className="w-[100vw] z-[99] h-fit fixed top-3 flex flex-row justify-between px-[3vw] custom-sm:px-1">
        <div className="flex  items-center gap-1 w-fit bg-white/30 p-[6px] rounded-xl  shadow-md">
          <div className="text-white w-fit">
            <UserRound size={20} />
          </div>
          <div className="text-white custom-sm:text-sm font-semibold">
            {user?.name || "User"}
          </div>
        </div>

        <div className="flex justify-center">
          <LogoutButton />
        </div>
      </div>
      <div className="bg-white/30 custom-xm:w-[95vw] custom-sm:w-[78vw] custom-xm:mt-10   backdrop-blur-xl  border-white/20 shadow-xl rounded-[2.5rem] gap-2 flex flex-col items-center h-[95vh] custom-xm:h-[90vh] w-[65vw]">
        <div className="flex flex-col text-3xl custom-xs:text-[26px] mt-2 text-white font-bold text-opacity-100">
          <div>
            <h3>Application Tracker</h3>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 custom-xs:gap-0 w-full shrink-0 ">
          <div className="w-[60vw] h-fit flex justify-center mb-2 ">
            <div className="relative w-[350px]">
              {/* Search Icon */}
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                size={16}
              />

              {/* Input */}
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                className="w-full custom-xs:h-7 custom-xs:w-[300px] rounded-xl pl-10 pr-10 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm bg-white/60"
              />

              {/* Clear Button  */}
              {searchItem && (
                <button
                  onClick={() => setSearchItem("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
          <div className="relative flex py-1 w-[60vw] custom-xs:w-[320px] h-5 items-center">
            <div className="flex-grow w-full border-t border-white"></div>
            <span className="flex w-[150px] justify-center mx-2 text-white text-[11px]">
              create job
            </span>
            <div className="flex-grow w-full border-t border-white"></div>
          </div>
          <div className="">
            <CreateButton onJobCreated={handleAddNewJob} />
          </div>

          <div className="relative flex py-1 w-[60vw] custom-xs:w-[320px] h-4 items-center">
            <div className="flex-grow w-full border-t border-white"></div>
            <span className="flex w-[100px] justify-center mx-0 text-white text-[11px]">
              sort
            </span>
            <div className="flex-grow w-full border-t border-white"></div>
          </div>

          <div className="w-[55vw] custom-md:w-fit h-9 custom-xs:gap-y-1 custom-xm:py-1 custom-xs:h-fit custom-xs:flex-wrap flex justify-center gap-2 text-slate-400 ">
            <button
              onClick={() => setSortBy("newest")}
              className={`px-2 transition duration-300 bg-white/20 rounded-xl w-[100px] custom-xm:w-fit custom-xm:text-[11px] ${
                sortBy === "newest"
                  ? "text-white bg-gray-600/30 font-semibold"
                  : "opacity-100  hover:bg-gray-200 hover:bg-opacity-40 hover:text-gray-700"
              }`}
            >
              Newest
            </button>

            <button
              onClick={() => setSortBy("oldest")}
              className={`px-2 transition duration-300 bg-white/20 rounded-xl w-[100px] custom-xm:w-fit custom-xm:text-[11px] ${
                sortBy === "oldest"
                  ? "text-white bg-gray-600/30 font-semibold"
                  : "opacity-100  hover:bg-gray-200 hover:bg-opacity-40 hover:text-gray-700"
              }`}
            >
              Oldest
            </button>

            <button
              onClick={() => setSortBy("company")}
              className={`px-2 transition duration-300 bg-white/20 rounded-xl w-[100px] custom-xm:w-fit custom-xm:text-[11px] ${
                sortBy === "company"
                  ? "text-white bg-gray-600/30 font-semibold"
                  : "opacity-100  hover:bg-gray-200 hover:bg-opacity-40 hover:text-gray-700"
              }`}
            >
              Company
            </button>

            <button
              onClick={() => setSortBy("position")}
              className={`px-2 transition duration-300 bg-white/20 rounded-xl w-[100px] custom-xm:w-fit custom-xm:text-[11px] ${
                sortBy === "position"
                  ? "text-white bg-gray-600/30 font-semibold"
                  : "opacity-100  hover:bg-gray-200 hover:bg-opacity-40 hover:text-gray-700"
              }`}
            >
              Position
            </button>

            <button
              onClick={() => setSortBy("status")}
              className={`px-2 transition duration-300 bg-white/20 rounded-xl w-[100px] custom-xm:w-fit custom-xm:text-[11px] ${
                sortBy === "status"
                  ? "text-white bg-gray-600/30 font-semibold"
                  : "opacity-100  hover:bg-gray-200 hover:bg-opacity-40 hover:text-gray-700"
              }`}
            >
              Status
            </button>

            <button
              onClick={() => setSortBy("location")}
              className={`px-2 transition duration-300 bg-white/20 rounded-xl w-[100px] custom-xm:w-fit custom-xm:text-[11px] ${
                sortBy === "location"
                  ? "text-white bg-gray-600/30 font-semibold "
                  : "opacity-100  hover:bg-gray-200 hover:bg-opacity-40 hover:text-gray-700"
              }`}
            >
              Location
            </button>
          </div>
        </div>
        <div className="relative flex w-[60vw] custom-xs:w-[320px] h-0 items-center">
          <div className="flex-grow w-full border-t border-white/50"></div>
          <div className="flex-grow w-full border-t border-white/50"></div>
        </div>
        <div className="px-2 py-1 flex-grow w-full custom-xm:w-full overflow-y-auto overflow-x-hidden rounded-b-[2.5rem] custom-scrollbar fade-bottom">
          <div className="flex flex-col gap-2 pb-6">
            {loading ? (
              <p className="text-center text-slate-500">Loading jobs...</p>
            ) : displayJobs.length === 0 ? (
              <p className="text-center text-slate-500">No jobs found</p>
            ) : (
              displayJobs.map((job) => (
                <JobBox
                  key={job.id}
                  data={job}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteJob}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
