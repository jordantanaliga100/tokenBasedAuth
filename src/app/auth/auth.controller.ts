// Register a new user

import { Request, Response } from "express";
import { ErrorClass } from "../../class/ErrorClass.js";
import { AuthResponseDTO, LoginDTO, RegisterDTO } from "./auth.dto.js";
import { AuthService } from "./auth.service.js";

export const CURRENT_USER = async (
  req: Request<{}, any, { user: any }, {}>,
  res: Response<AuthResponseDTO>
) => {
  try {
    const { meta, ...safeSession } = req.user;

    res.status(201).json({
      success: true,
      message: "Current User",
      data: {
        user: safeSession,
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const REGISTER_USER = async (
  req: Request<{}, any, RegisterDTO, {}>,
  res: Response<AuthResponseDTO>
): Promise<void> => {
  try {
    const {
      body: { username, email, password },
    } = req;
    if (!email || !password || !username) {
      throw new ErrorClass.BadRequest("All fields are required ! 💁");
    }
    const user = await AuthService.register(req.body);

    // serialize here...
    const { password: pass, ...safefuser } = user as any;

    console.log("NEWLY REGISTERED USER 👧", user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: safefuser,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// User Login
export const LOGIN_USER = async (
  req: Request<{}, any, LoginDTO, {}>,
  res: Response<AuthResponseDTO>
): Promise<void> => {
  const {
    body: { email, password },
  } = req;
  const userAgent = req.headers["user-agent"] || "unknown";
  const userIP =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.ip;
  try {
    if (!email || !password) {
      throw new ErrorClass.BadRequest("Must have email and password");
    }

    const user = await AuthService.login(req.body, userAgent, userIP);
    console.log("NEWLY LOGGED IN USER 👧", user);

    // 🔴 SAVED TO SESSION
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      meta: {
        ip: req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.ip,
        userAgent: req.headers["user-agent"] || "unknown",
      },
    };

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// User Logout
export const LOGOUT_USER = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to logout" });
      }

      // 3️⃣ Clear cookie (connect.sid is default for express-session)
      res.clearCookie("session_id", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // 4️⃣ Success response
      res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
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
