/* eslint-disable react-refresh/only-export-components */
"use client";

import type React from "react";
import { useState, useEffect, createContext } from "react";

interface User {
  expires_at: string;
  token: string;
  lifetime: number;
}

interface AuthContextType {
  user: User | null;
  login: (
    username: string,
    password: string,
    subdomain: string
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string,
    subdomain: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://${subdomain}.ox-sys.com/security/auth_check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: `_username=${username}&_password=${password}&_subdomain=${subdomain}`,
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login xatosi:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
