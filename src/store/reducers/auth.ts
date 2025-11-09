import {createSelector, createSlice, type PayloadAction,} from "@reduxjs/toolkit";
import type {IAppState, IAuthState} from "../store.ts";
import type {ILoginResponse} from "../../types/auth.type.ts";

const initialState: IAuthState = {
    roleNames: [],
    email: "",
    fullName: "",
    isAuthenticated: false,
    accessToken: "",
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
                email,
                id,
                fullName,
            } = action.payload;
            state.isAuthenticated = true;
            state.accessToken = accessToken
            state.roleNames = roleNames
            state.email = email
            state.fullName = fullName
            state.id = id
        },
        setAccessToken(state: IAuthState, action: PayloadAction<string>) {
            state.accessToken = action.payload;
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

export const {updateRole, logOut, loginSuccess, setAccessToken} = authReducer.actions;

export default authReducer;
