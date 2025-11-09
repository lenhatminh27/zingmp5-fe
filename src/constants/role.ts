export const ROLES = {
    ADMIN: "ADMIN",
    ARTIST: "ARTIST",
    USER: "USER",
} as const;
export type Role = keyof typeof ROLES | (typeof ROLES)[keyof typeof ROLES];
