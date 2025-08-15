import { Response } from "express";
export const setSession = (res: Response, token: string) => {
  res.cookie("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: Date.now() + 1000 * 10,
  });
};
