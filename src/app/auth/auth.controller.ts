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
    // Naka-attach na ang session/user info sa req.body.user via AuthGuards
    const user = req.user;
    const session = req.session;

    // console.log("FROM AUTH GUARDS user 👮‍♂️", user);
    // console.log("FROM AUTH GUARDS session 🌄", session);

    res.status(201).json({
      success: true,
      message: "Current User",
      data: {
        user,
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
  const {
    body: { username, email, password },
  } = req;

  try {
    if (!email || !password || !username) {
      throw new ErrorClass.BadRequest("All fields are required ! 💁");
    }
    const user = await AuthService.register(req.body);

    console.log("NEWLY REGISTERED USER 👧", user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
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

    // wag mona tayo rito
    const user = await AuthService.login(req.body, userAgent, userIP);
    console.log("NEWLY LOGGED IN USER 👧", user);
    res.cookie("session_token", user.sessionToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: Date.now() + 1000 * 10, // 10 seconds
    });
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
    // kunin ang session token sa cookies
    const cookies = req.headers.cookie;
    console.log("RAW COOKIE HEADER:", cookies);

    if (!cookies) {
      throw new ErrorClass.NotFound("No cookies found in request.");
    }
    console.log("CURRENT COOKIES", cookies);

    const token = cookies
      .split(";")
      .find((c) => c.trim().startsWith("session_token="))
      ?.split("=")[1];

    if (!token) {
      throw new ErrorClass.BadRequest("No active session found.");
    }
    await AuthService.logout(token);

    // // clear the cookie
    res.clearCookie("session_token", {
      httpOnly: false,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
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
