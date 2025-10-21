import {createSelector, createSlice, type PayloadAction,} from "@reduxjs/toolkit";
import type {IAppState, IAuthState} from "../store.ts";
import type {ILoginResponse, PackageServiceType} from "../../types/auth.type.ts";

const initialState: IAuthState = {
    roleNames: [],
    email: "",
    fullName: "",
    isAuthenticated: false,
    accessToken: "",
    refreshToken: "",
    firstUpdated: false,
    companyStatus: null,
    badges: [],
    packageService: "FREE"
};

const authReducer = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateRole(state: IAuthState, action: PayloadAction<string[]>) {
            state.roleNames = action.payload;
        },
        loginSuccess(state: IAuthState, action: PayloadAction<ILoginResponse>) {
            const {
                roleNames,
                accessToken,
                refreshToken,
                email,
                id,
                fullName,
                firstUpdate,
                companyStatus,
                badges,
                packageService
            } = action.payload;
            state.isAuthenticated = true;
            state.accessToken = accessToken
            state.roleNames = roleNames
            state.email = email
            state.fullName = fullName
            state.id = id
            state.refreshToken = refreshToken
            state.firstUpdated = firstUpdate
            state.companyStatus = companyStatus
            state.badges = badges
            state.packageService = packageService
        },
        setAccessToken(state: IAuthState, action: PayloadAction<string>) {
            state.accessToken = action.payload;
        },
        setPackageService(state: IAuthState, action: PayloadAction<PackageServiceType>) {
            state.packageService = action.payload;
        },
        logOut() {
            return initialState;
        },
    },
});

const rootState = (state: IAppState) => state.auth;

export const getRole = createSelector(
    rootState,
    (state: IAuthState) => state.roleNames || [],
);
export const getAccessToken = createSelector(
    rootState,
    (state: IAuthState) => state.accessToken,
);
export const getRefreshToken = createSelector(
    rootState,
    (state: IAuthState) => state.refreshToken,
);
export const isUserAuthenticated = createSelector(
    rootState,
    (state: IAuthState) => state.isAuthenticated,
);
export const getName = createSelector(
    rootState,
    (state: IAuthState) => state.fullName,
);
export const getEmail = createSelector(
    rootState,
    (state: IAuthState) => state.email,
);
export const getId = createSelector(
    rootState,
    (state: IAuthState) => state.id,
)

export const isFirstUpdate = createSelector(
    rootState,
    (state: IAuthState) => state.firstUpdated,
)

export const getCompanyStatus = createSelector(
    rootState,
    (state: IAuthState) => state.companyStatus,
)

export const getBadge = createSelector(rootState, (state: IAuthState) => state.badges);

export const getPackageService = createSelector(rootState, (state: IAuthState) => state.packageService);

export const {updateRole, logOut, loginSuccess, setAccessToken, setPackageService} = authReducer.actions;

export default authReducer;
