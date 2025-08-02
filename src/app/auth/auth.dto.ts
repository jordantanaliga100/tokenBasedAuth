import { CreateDTO, ResponseDTO } from "../../utils/global-dto.js";

export interface AuthDTO {
  id?: string; // optional for input, required sa response
  email?: string;
  password?: string;
  username?: string; // optional depende sa registration
  created_at?: Date;
  updated_at?: Date;
}

export type RegisterDTO = CreateDTO<
  Pick<AuthDTO, "username" | "email" | "password">
>;
export type LoginDTO = CreateDTO<Pick<AuthDTO, "email" | "password">>;
export type AuthResponseDTO = ResponseDTO<
  AuthDTO,
  { cookie?: string; user?: any; session?: any }
>;
// export type CurrentUserResponseDTO = ResponseDTO<{ cookie?: string }>;

// // src/modules/auth/auth.dto.ts

// /**
//  * 🔹 Base interface: lahat ng fields ng Auth/User
//  * Ito yung pinaka root na pwede mong i-derive sa lahat.
//  */
// export interface AuthDTO {
//   id?: string;       // optional for input, required sa response
//   email: string;
//   password: string;
//   username?: string; // optional depende sa registration
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// /**
//  * 🔹 RegisterDTO: required email, password, username
//  */
// export type RegisterDTO = Pick<AuthDTO, "email" | "password" | "username">;

// /**
//  * 🔹 LoginDTO: email at password lang
//  */
// export type LoginDTO = Pick<AuthDTO, "email" | "password">;

// /**
//  * 🔹 ResponseDTO: hindi natin isasama ang password
//  */
// export type UserResponseDTO = Omit<AuthDTO, "password">;

// /**
//  * 🔹 UpdateDTO: pwede nilang i-update kahit alin (lahat optional)
//  */
// export type UpdateUserDTO = Partial<Omit<AuthDTO, "id">>;

// /**
//  * 🔹 SessionDTO: kapag may session ka sa response
//  */
// export interface SessionResponseDTO extends UserResponseDTO {
//   sessionToken: string;
// }
