// src/pages/Landing.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LogButton from "../components/LogButton";
import LogInput from "../components/LogInput";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputs;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate("/dashboard");
    
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-gradient-to-br from-blue-300/95 via-purple-300 to-red-300">
      {/* Card box */}
      <div className="bg-white/30 shadow-md rounded-xl w-96 custom-xs:w-[93vw] p-8 flex flex-col gap-6">
        {/* header */}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-white text-center">
            Application Tracker
          </h1>
          <p className="text-white text-sm mt-1">Welcome</p>
        </div>

        {/* Forms */}
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <LogInput
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={onChange}
          />
          <LogInput
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
          />
          <div className="mt-2">
            <LogButton text="Log in" type="submit" variant="primary" />
          </div>
        </form>

        {/* Seperating line */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white"></div>
          <span className="flex-shrink mx-4 text-white text-xs">
            Don't have an account?
          </span>
          <div className="flex-grow border-t border-white"></div>
        </div>

        {/* Register Button */}
        <div>
          <LogButton text="Register" to="/register" variant="secondary" />
        </div>
      </div>
    </div>
  );
};

export default Landing;