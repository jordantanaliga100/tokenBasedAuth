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

  public getUser() {
    return {
      count: this.users.length, // number of users
      users: this.users, // optional: full list
    };
  }
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
    const hashedPassword = await hashPassword(userData.password);
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

  public async login(userData: LoginDTO) {
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

    // 2. Compare password
    const isPasswordValid = await comparePassword(
      userData.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new ErrorClass.BadRequest("Invalid email or password.");
    }

    // 3. Remove password before returning
    delete user.password;

    return user; // may id, username, email, created_at, updated_at
  }

  public async logout(tokenOrSessionId: string) {
    return { message: "User logged out successfully" };
  }

  public async forgotPassword(email: string) {
    return { message: "Password reset link sent" };
  }
}
export const AuthService = new Auth();
