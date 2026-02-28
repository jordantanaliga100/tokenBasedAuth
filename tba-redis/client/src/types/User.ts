export const Role = {
  Admin: "admin",
  Moderator: "moderator",
  User: "user",
} as const;

// Kukunin natin ang values ng Role object para gawing Type
export type RoleType = (typeof Role)[keyof typeof Role];

export interface User {
  readonly id: string;
  username: string;
  email: string;
  role: RoleType; // Gamitin ang bagong RoleType dito
  is_verified?: boolean;
}
