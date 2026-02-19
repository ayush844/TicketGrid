export const ROLES = {
  USER: "USER",
  ORGANIZER: "ADMIN"
} as const;


export type Roles = (typeof ROLES)[keyof typeof ROLES];