import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext"; 
import LogButton from "../components/LogButton";
import LogInput from "../components/LogInput";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); 

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { email, password, confirmPassword } = inputs;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const body = {
        email,
        password,
        name: email.split("@")[0], // 'user123@gmail.com' -> 'user123' 
      };

      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const contentType = response.headers.get("content-type");
      let parseRes;

      if (contentType && contentType.includes("application/json")) {
        parseRes = await response.json();
      } else {
        const textRes = await response.text();
        throw new Error(textRes || "Server error occurred.");
      }

      if (response.ok) {
        localStorage.setItem("token", parseRes.token);
        

        setUser({
          name: parseRes.user?.name || body.name,
          email: parseRes.user?.email || body.email,
          id: parseRes.user?.id || parseRes.userId || ""
        });
        
        toast.success("Account Created Successfully!");
        navigate("/dashboard");
      } else {
        toast.error(
          typeof parseRes === "string" ? parseRes : parseRes.msg || parseRes,
        );
      }
    } catch (err: any) {
      console.error(err.message);
      toast.error(
        err.message === "Server Error"
          ? "Server error occurred."
          : err.message,
      );
    }
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-gradient-to-br from-blue-300/95 via-purple-300 to-red-300">
      <div className="bg-white/30 border-2 border-gray-200 rounded-xl shadow-xl w-96 p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-blue-600/50">Register</h1>
          <p className="text-white text-sm mt-1">Join Our Community</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <LogInput
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={onChange}
          />
          <LogInput
            type="password"
            name="password"
            placeholder="Create Password"
            value={password}
            onChange={onChange}
          />
          <LogInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={onChange}
          />
          <div className="mt-2">
            <LogButton text="Create Account" type="submit" variant="primary" />
          </div>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white"></div>
          <span className="flex-shrink mx-4 text-white text-xs">
            Already have an account?  
          </span>
          <div className="flex-grow border-t border-white"></div>
        </div>

        <div>
          <LogButton text="Sign In" to="/" variant="secondary" />
        </div>
      </div>
    </div>
  );
};

export default Register;