// Register a new user

import { Request, Response } from "express";
import { ErrorClass } from "../../class/ErrorClass.js";
import { ApiResponse, ErrorResponse } from "../../dto/global.dto.js";
import { SafeUserDTO } from "../../dto/user.dto.js";
import { LoginDTO, RegisterDTO } from "./auth.dto.js";
import { AuthService } from "./auth.service.js";

export const CURRENT_USER = async (
  req: Request,
  res: Response<ApiResponse<SafeUserDTO> | ErrorResponse>
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "No user logged in",
      });

      return;
    }

    const { ...safeUser } = req.user as SafeUserDTO;

    res.status(200).json({
      success: true,
      message: "Current user retrieved successfully",
      data: safeUser,
    } as ApiResponse<SafeUserDTO>);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unknown error",
      });
    }
  }
};
export const REGISTER_USER = async (
  req: Request<{}, any, RegisterDTO, {}>,
  res: Response<ApiResponse<SafeUserDTO> | ErrorResponse>
): Promise<void> => {
  try {
    const {
      body: { username, email, password },
    } = req;
    console.log("REQUEST BODY", req.body);

    if (!email || !password || !username) {
      throw new ErrorClass.BadRequest("All fields are required ! 💁");
    }
    const user = await AuthService.register(req.body);

    const safeUser: SafeUserDTO = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: safeUser,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: "Unknown error" });
    }
  }
};
// User Login
export const LOGIN_USER = async (
  req: Request<{}, {}, LoginDTO>,
  res: Response<ApiResponse<SafeUserDTO> | ErrorResponse>
): Promise<void> => {
  try {
    const { email, password } = req.body;

    console.log("REQUEST BODY", req.body);
    const userAgent = req.headers["user-agent"] || "unknown";
    const userIP =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.ip;

    if (!email || !password) {
      throw new ErrorClass.BadRequest("Must have email and password");
    }

    const user = await AuthService.login(req.body, userAgent, userIP);

    // Save to session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      meta: { ip: userIP, userAgent },
    };

    const safeUser: SafeUserDTO = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: safeUser,
    } as ApiResponse<SafeUserDTO>);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const err = error as Express.CustomError;
      res.status(err.statusCode || 400).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unknown error",
      });
    }
  }
};

// User Logout
export const LOGOUT_USER = async (
  req: Request,
  res: Response<ApiResponse<null> | ErrorResponse>
): Promise<void> => {
  try {
    if (!req.session) {
      // no session exists (e.g. already logged out)
      res.status(200).json({
        success: true,
        message: "No active session. User already logged out.",
        data: null,
      });
    }

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Session destroy error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to destroy session",
        });
      }

      // Clear the session cookie
      res.clearCookie("session_id", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        success: true,
        message: "User logged out successfully",
        data: null,
      });
    });
  } catch (error) {
    console.error("🚨 Logout controller error:", error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Unexpected logout error",
    });
  }
};

// Forgot Password
export const FORGOT_PASSWORD = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
