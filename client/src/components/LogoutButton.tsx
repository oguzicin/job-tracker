import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext"; 

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  const handleLogout = () => {

    logout();
    

    toast.info("Succesfully logged out.");
    

    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/90 bg-white/30 hover:bg-slate-500/30 hover:text-white hover:border-none rounded-lg transition-all shadow-md active:scale-95"
    >
      <LogOut size={18} />
      <span>Exit</span>
    </button>
  );
};

export default LogoutButton;