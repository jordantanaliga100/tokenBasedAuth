// Register a new user

import { Request, Response } from "express";
import { ErrorClass } from "../../class/ErrorClass.js";
import { LoginUserDTO } from "./auth.dto.js";
import { AuthService } from "./auth.service.js";

export const REGISTER_USER = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    body: { password, email },
  } = req;
  try {
    if (!email || !password) {
      throw new ErrorClass.BadRequest("Must have email and password");
    }
    const user = await AuthService.REGISTER(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// User Login
export const LOGIN_USER = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body as LoginUserDTO;
  try {
    if (!email || !password) {
      throw new ErrorClass.BadRequest("Must have email and password");
    }
    const user = await AuthService.LOGIN(req.body);
    res
      .status(200)
      .json({ success: true, message: "User logged in successfully", user });
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
    const token = req.cookies.token;

    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
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
