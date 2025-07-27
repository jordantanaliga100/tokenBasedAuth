// Register a new user

import { Request, Response } from "express";
import { ErrorClass } from "../../class/ErrorClass.js";
import { AuthResponseDTO, LoginDTO, RegisterDTO } from "./auth.dto.js";
import { AuthService } from "./auth.service.js";

export const REGISTER_USER = async (
  req: Request<{}, any, RegisterDTO, {}>,
  res: Response<AuthResponseDTO>
): Promise<void> => {
  const {
    body: { username, email, password },
  } = req;
  console.log(req.body);

  try {
    if (!email || !password || !username) {
      throw new ErrorClass.BadRequest("All fields are required ! 💁");
    }
    // wag mona tayo rito
    const user = await AuthService.register(req.body);

    console.log("LIST OF USERS 👧", AuthService.getUser());

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
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

  try {
    if (!email || !password) {
      throw new ErrorClass.BadRequest("Must have email and password");
    }

    // wag mona tayo rito
    const user = await AuthService.login(req.body);
    console.log("LIST OF USERS 👧", AuthService.getUser());

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
