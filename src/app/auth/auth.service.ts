import { v4 as uudiv4 } from "uuid";
import { ErrorClass } from "../../class/ErrorClass.js";
import { hashPassword } from "../../utils/hashPass.js";
import { LoginUserDTO, RegisterUserDTO } from "./auth.dto.js";

// Register a new user
export const REGISTER = async (userData: RegisterUserDTO) => {
  console.log("SERVICES", userData);

  let db;

  // CHECK IF THERE IS AN EXISTING USER
  const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [
    userData.email,
  ]);
  // .. throw errors if it exists

  if (existingUser.rows.length > 0) {
    throw new ErrorClass.BadRequest(
      "User already exists.. Please login to an exisitng account"
    );
  }
  // HASHED PASSWORD BEFORE STORING TO DB
  const hashedPassword = await hashPassword(userData.password);

  // ADD UUID
  const id = uudiv4();

  // AND THEN INSERT INTO USER TABLE
  const result = await db.query(
    ` INSERT INTO users (id, email, hashed_password)
      VALUES ($1, $2, $3)
      RETURNING id, email, created_at
    `,
    [id, userData.email, hashedPassword]
  );

  return result.rows[0];
};

// User Login
export const LOGIN = async (userData: LoginUserDTO) => {
  console.log("SERVICES", userData);

  return {};
};

// User Logout
export const LOGOUT = async (tokenOrSessionId: string) => {
  return { message: "User logged out successfully" };
};

// Forgot Password
export const FORGOT_PASSWORD = async (email: string) => {
  return { message: "Password reset link sent" };
};

export const AuthService = {
  REGISTER,
  LOGIN,
  LOGOUT,
  FORGOT_PASSWORD,
};
