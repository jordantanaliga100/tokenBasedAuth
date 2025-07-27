import { v4 as uuidv4 } from "uuid";
import { ErrorClass } from "../../class/ErrorClass.js";
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
  public async register(userData: RegisterDTO) {
    const existingUser = this.users.find((u) => u.email === userData.email);
    if (existingUser) {
      throw new ErrorClass.BadRequest("User already exists.");
    }

    const hashedPassword = await hashPassword(userData.password);
    const newUser = {
      id: uuidv4(),
      email: userData.email,
      username: userData.username,
      password: hashedPassword,
    };
    this.users.push(newUser);
    return {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      created_at: new Date(),
    };
  }

  public async login(userData: LoginDTO) {
    const user = this.users.find((u) => u.email === userData.email);
    if (!user) {
      throw new ErrorClass.BadRequest(
        `💁 No user found with email: ${userData.email}`
      );
    }

    const isMatch = await comparePassword(userData.password, user.password);
    if (!isMatch) {
      throw new ErrorClass.BadRequest("Password Incorrect");
    }

    return { id: user.id, username: user.username, email: user.email };
  }

  public async logout(tokenOrSessionId: string) {
    return { message: "User logged out successfully" };
  }

  public async forgotPassword(email: string) {
    return { message: "Password reset link sent" };
  }
}
export const AuthService = new Auth();
