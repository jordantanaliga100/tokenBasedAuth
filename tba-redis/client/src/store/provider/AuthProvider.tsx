/* eslint-disable no-useless-catch */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import API from "../../api/axios";
import type { User } from "../../types/User";
import {
  AuthContext,
  type LoginData,
  type RegisterData,
} from "../context/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Para sa initial check
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // ✨ 1. New state for message
  const [isVerifying, setIsVerifying] = useState<boolean>(false); // ✨ 1. Bago para sa verification
  const [error, setError] = useState<string | null>(null);

  // ✨ UPDATED: Login function accepts LoginData
  const login = async (userData: LoginData) => {
    setIsLoading(true);
    try {
      // Backend expects email/username and password
      const response = await API.post("/auth/sign-in", userData);
      console.log("res", response.data.data);

      // Backend returns full User object
      setUser(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✨ UPDATED: Register function accepts RegisterData
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await API.post("/auth/sign-up", userData);
      setUser(response.data.data); // Automatic login
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await API.get("/auth/logout"); // 💡 Tawagin ang backend logout
      setUser(null);
    } catch (err: any) {
      console.error("Logout failed", err);
    }
  };

  // const checkAuth = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await API.get("/auth/me"); // 💡 Tatanungin ang backend kung may session
  //     setUser(response.data);
  //     setError(null);
  //   } catch (err: any) {
  //     console.log("No active session");
  //     setUser(null);
  //     // Hindi natin kailangan i-set ang error dito para hindi magulat ang user
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const requestVerification = async () => {
    setIsVerifying(true); // ✨ 2. Gamitin ang bagong state
    try {
      return await API.post("/auth/request-verification");
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyEmail = async (otp: string) => {
    setIsVerifying(true); // ✨ 3. Gamitin ang bagong state
    try {
      const response = await API.post("/auth/verify-email", { otp });
      // ✨ 2. Set the success message
      setSuccessMessage("🔐 Account successfully verified!");
      // UPDATE USER STATE
      // Optional: Clear the message after a few seconds
      setTimeout(() => setSuccessMessage(null), 5000);
      setUser(response.data.data);
      setIsLoading(false);
      return response;
    } finally {
      setIsLoading(false);
      setIsVerifying(false);
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    setIsVerifying(true); // O kung ano man ang loading state mo
    try {
      // return "hit forgot password";
      const response = await API.post("/auth/forgot-password", { email });
      console.log("response from forgot pass", response);

      return response.data.message;
    } catch (error: any) {
      throw error; // I-throw para mahuli ng catch sa UI (SignIn/ForgotPassword page)
    } finally {
      setIsVerifying(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setIsVerifying(true); // O gamitin mo yung isLoadin state mo
    try {
      // ✨ Dito tatawagin ang endpoint ng backend
      const response = await API.post("/auth/reset-password", {
        token,
        newPassword,
      });

      return response.data.message;
    } catch (error: any) {
      // I-throw ang error para mahuli sa UI component (reset-password page)
      throw error;
    } finally {
      setIsVerifying(false);
    }
  };
  // ✨ This function should run on refresh
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/auth/me");

      // ✨ Check if the response is actually a 401 based on status
      if (response.status === 401) {
        console.log("User not logged in - silent 401");
        setUser(null);
      } else {
        setUser(response.data.user);
      }
    } catch (error: any) {
      // This will only catch 500 errors now
      console.error("Critical Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <AuthContext.Provider
      value={{
        error,
        user,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
        requestVerification,
        verifyEmail,
        isVerifying,
        successMessage,
        sendPasswordResetEmail,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
