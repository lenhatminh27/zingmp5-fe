import type {ROLES} from "../constants/role.ts";

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginWithGoogleRequest {
    email: string;
    googleToken: string;
    avatar: string;
    displayName: string;
    phoneNumber: string;
}

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export type BadgeType = "FIRST_JOB" | "STREAK_LOGGED_IN"

export type PackageServiceType = "FREE" | "PRO" | "STANDARD" | "PREMIUM"

export type CompanyStatus = "ACTIVE" | "WAITING" | "BLOCKED"

export interface ILoginResponse {
    id: number;
    email: string;
    fullName: string;
    accessToken: string;
    refreshToken: string;
    roleNames: RoleType[];
    firstUpdate: boolean
    companyStatus: CompanyStatus | null;
    badges: BadgeType[];
    packageService: PackageServiceType
}

export interface ISignupRequest {
    email: string
    fullName: string
    password: string
    activeCode: string
    role: RoleType
}