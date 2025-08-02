import { ResultSetHeader } from "mysql2";
import { v4 as uuidv4 } from "uuid";
import { ErrorClass } from "../../class/ErrorClass.js";
import { getPool } from "../../db/mysql/mysql.js";
import { comparePassword, hashPassword } from "../../utils/hashPass.js";
import { LoginDTO, RegisterDTO } from "./auth.dto.js";
class Auth {
  private users: Array<{
    id: string;
    email: string;
    username?: string;
    password: string;
  }> = [];

  // public async register(userData: RegisterDTO) {
  //   const existingUser = this.users.find((u) => u.email === userData.email);
  //   if (existingUser) {
  //     throw new ErrorClass.BadRequest("User already exists.");
  //   }

  //   const hashedPassword = await hashPassword(userData.password);
  //   const newUser = {
  //     id: uuidv4(),
  //     email: userData.email,
  //     username: userData.username,
  //     password: hashedPassword,
  //   };
  //   this.users.push(newUser);
  //   return {
  //     id: newUser.id,
  //     email: newUser.email,
  //     username: newUser.username,
  //     created_at: new Date(),
  //   };
  // }

  public async register(userData: RegisterDTO) {
    // console.log("🙋 User from Userdata", userData);

    // check the user if it exists
    const pool = getPool()!;
    const [rows] = await pool?.query(` SELECT id FROM users WHERE email = ? `, [
      userData.email,
    ]);
    // console.log("existing user", rows);
    const existingUser = rows as Array<{ id: string }>;
    if (existingUser.length > 0) {
      console.log("User already exists:", existingUser[0]);
      throw new ErrorClass.BadRequest("User already exists.");
    }
    // hashed then
    const hashedPassword = await hashPassword(userData.password!);
    // create user
    const userId = uuidv4();
    const [result] = await pool.query(
      `
      INSERT INTO users (id, username, email, password) 
      VALUES (?, ?, ?, ?)
      `,
      [userId, userData.username, userData.email, hashedPassword]
    );
    // fetch the user
    const [userRows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [
      userId,
    ]);

    // return
    const user = (userRows as Array<any>)[0];

    return user;
  }

  // public async login(userData: LoginDTO) {
  //   const user = this.users.find((u) => u.email === userData.email);
  //   if (!user) {
  //     throw new ErrorClass.BadRequest(
  //       `💁 No user found with email: ${userData.email}`
  //     );
  //   }

  //   const isMatch = await comparePassword(userData.password, user.password);
  //   if (!isMatch) {
  //     throw new ErrorClass.BadRequest("Password Incorrect");
  //   }

  //   return { id: user.id, username: user.username, email: user.email };
  // }
  public async login(
    userData: LoginDTO,
    userAgent: string,
    userIP: string | undefined
  ) {
    const pool = getPool()!;

    // 1. Find user by email
    const [rows] = await pool.query(
      `SELECT id, username, email, password, created_at, updated_at 
     FROM users WHERE email = ?`,
      [userData.email]
    );

    const user = (rows as Array<any>)[0];
    if (!user) {
      throw new ErrorClass.BadRequest(
        `💁 No user found with email: ${userData.email}`
      );
    }

    // 2. Compare password (STOP if invalid)
    const isPasswordValid = await comparePassword(
      userData.password!,
      user.password
    );

    if (!isPasswordValid) {
      throw new ErrorClass.BadRequest("Invalid email or password.");
    }

    // 3. Create session only if password is valid
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 10); // 10 seconds

    // OPTIONAL: delete old sessions (kung single session policy)
    await pool.query(`DELETE FROM sessions WHERE user_id = ?`, [user.id]);

    await pool.query(
      `
    INSERT INTO sessions (id, user_id, session_token, user_agent, ip_address, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
      [uuidv4(), user.id, sessionToken, userAgent, userIP, expiresAt]
    );

    // 4. Remove password before returning
    delete user.password;

    // 5. Return user + session token (para sa controller)
    return { ...user, sessionToken };
  }

  public async logout(session_token: string) {
    const pool = getPool()!;
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM sessions WHERE session_token = ?",
      [session_token]
    );
    if (result.affectedRows === 0) {
      throw new ErrorClass.NotFound("Session not found or already logged out.");
    }
    return { message: "User logged out successfully" };
  }

  public async forgotPassword(email: string) {
    return { message: "Password reset link sent" };
  }
}
export const AuthService = new Auth();
