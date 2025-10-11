import { SafeUserDTO, User } from "../../dto/user.dto.js";

// 🔵 Incoming request DTOs
export type CreateUserDTO = Partial<Pick<User, "username" | "email">>; // user can update username or email
export type ChangePasswordDTO = Pick<User, "password"> & {
  newPassword: string;
};

// 🟢 Outgoing response DTOs
export type UserProfileDTO = SafeUserDTO; // always safe to return
