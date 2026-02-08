import React from "react";
import { Link } from "react-router-dom";

interface LogButtonProps {
  text: string;
  to?: string;          
  onClick?: () => void; 
  type?: "button" | "submit" | "reset"; 
  variant?: "primary" | "secondary"; 
}

const LogButton: React.FC<LogButtonProps> = ({ 
  text, 
  to, 
  onClick, 
  type = "button", 
  variant = "primary" 
}) => {
  
 
  const baseStyle = `w-full px-6 py-2 font-bold rounded-lg transition transform hover:-translate-y-0.5 text-center cursor-pointer block`;
  
 
  const variantStyles = variant === 'primary' 
    ? "bg-white/30 border-2 border-white text-white shadow-md hover:bg-blue-700/50" 
    : "bg-white/30 border-2 border-blue-600/60 text-white hover:bg-blue-600/60 hover:text-white shadow-md";

  
  if (to) {
    return (
      <Link to={to} className={`${baseStyle} ${variantStyles}`}>
        {text}
      </Link>
    );
  }

  
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyle} ${variantStyles}`}
    >
      {text}
    </button>
  );
};

export default LogButton;