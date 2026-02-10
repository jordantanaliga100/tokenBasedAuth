import { NextFunction, Request, Response } from "express";
import { ErrorClass } from "../class/ErrorClass.js";
import { getPool } from "../db/mysql/mysql.js";

export default async function AuthGuards(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const sess = req.session;

    console.log("FROM AUTH GUARDS user 👮‍♂️", user);
    console.log("FROM AUTH GUARDS session 🌄", sess);

    const pool = getPool()!;
    const cookies = req.headers.cookie;

    console.log("RAW COOKIE HEADER:", cookies);

    if (!cookies) {
      throw new ErrorClass.NotFound("No cookies found in request.");
    }

    // Parse session_token from cookies
    const token = cookies
      .split(";")
      .find((c) => c.trim().startsWith("session_token"))
      ?.split("=")[1];

    if (!token) {
      throw new ErrorClass.Unauthorized("Session expired or invalid.");
    }

    // Lookup session in DB
    const [rows] = await pool.query(
      `SELECT * FROM sessions WHERE session_token = ?`,
      [token]
    );

    if ((rows as any[]).length === 0) {
      throw new ErrorClass.Unauthorized("Session expired, Please login");
    }

    const session = (rows as any[])[0];

    if (!session) {
      throw new ErrorClass.Unauthorized("Session not found, Please login");
    }

    // 🔥 Check if expired
    if (new Date(session.expires_at) < new Date()) {
      // Optional: remove expired session from DB
      await pool.query(`DELETE FROM sessions WHERE session_token = ?`, [token]);
      throw new ErrorClass.Unauthorized("Session expired, Please login");
    }

    // ✅ Rolling expiration: extend session
    const newExpiry = new Date(Date.now() + 1000 * 10); // extend 10s
    await pool.query(
      `UPDATE sessions SET expires_at = ?, last_used = NOW() WHERE session_token = ?`,
      [newExpiry, token]
    );
    // Fetch user linked to this session
    const [users] = await pool.query(
      `SELECT id, username, email FROM users WHERE id = ?`,
      [session.user_id]
    );

    if ((users as any[]).length === 0) {
      throw new ErrorClass.NotFound("User not found.");
    }

    // Attach user + session sa request object
    req.user = (users as any[])[0]; // user object lang
    req.session = session; // full session details

    next();
  } catch (error) {
    // Pag nagthrow sa loob, handle na dito
    next(error);
  }
}
