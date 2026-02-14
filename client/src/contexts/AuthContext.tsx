// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";

interface User {
  name: string;
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
}

const API_BASE_URL = process.env.REACT_APP_API_URL;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: { token: token },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Kullanıcı bilgileri alınamadı:", error);
          localStorage.removeItem("token");
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const parseRes = await response.json();

      if (response.ok) {
        localStorage.setItem("token", parseRes.token);
        setUser({
          name: parseRes.user?.name || parseRes.name || email.split("@")[0],
          email: parseRes.user?.email || parseRes.email || email,
          id: parseRes.user?.id || parseRes.userId || "",
        });
        toast.success("Login Successful!", { toastId: "login-success" });
        return true;
      }

      const errorMessage = (parseRes?.msg ?? "").toLowerCase();

      if (errorMessage.includes("not found") || errorMessage.includes("exist")) {
        toast.error("Couldn't find user", { toastId: "login-error" });
      } else if (errorMessage.includes("password") || errorMessage.includes("incorrect") || errorMessage.includes("wrong")) {
        toast.error("Incorrect password", { toastId: "login-error" });
      } else {
        toast.error("Login failed. Please try again.", { toastId: "login-error" });
      }

      return false;
    } catch (err: any) {
      console.error(err.message);
      toast.error("Server Error: " + (err.message || "An error occurred"), { toastId: "login-error" });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        logout,
        loading,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};