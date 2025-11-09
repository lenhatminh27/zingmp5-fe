import {createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {IAppState, IAuthState} from "../store.ts";

/** 2 dạng payload:
 * 1) BE: { token, account: { _id, email, roles[], fullName?, avatar? } }
 * 2) Legacy: { accessToken, id, email, fullName?, roleNames[] }
 */
type LoginPayloadFromBE = {
    token: string;
    account: {
        _id: string;
        email: string;
        avatar?: string;
        roles: string[];
        fullName?: string;
    };
};

type LoginPayloadLegacy = {
    accessToken: string;
    id: string;
    email: string;
    fullName?: string;
    roleNames: string[];
};

type LoginSuccessPayload = LoginPayloadFromBE | LoginPayloadLegacy;

// ✅ type guard rõ ràng để TS narrow chính xác
const isFromBE = (p: LoginSuccessPayload): p is LoginPayloadFromBE => {
    return "token" in p;
};

const initialState: IAuthState = {
    roleNames: [],
    email: "",
    fullName: "",
    isAuthenticated: false,
    accessToken: "",
    id: "",
    // nếu IAuthState có avatar thì thêm field này:
    // avatar: "",
};

const normalizeLogin = (p: LoginSuccessPayload) => {
    if (isFromBE(p)) {
        const {token, account} = p;
        return {
            accessToken: token,
            id: account._id,
            email: account.email,
            fullName: account.fullName ?? "",
            roleNames: account.roles ?? [],
            avatar: account.avatar ?? "",
        };
    }
    // legacy
    return {
        accessToken: p.accessToken,
        id: p.id,
        email: p.email,
        fullName: p.fullName ?? "",
        roleNames: p.roleNames ?? [],
        avatar: "",
    };
};

const authReducer = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateRole(state: IAuthState, action: PayloadAction<string[]>) {
            state.roleNames = action.payload ?? [];
        },
        loginSuccess(state: IAuthState, action: PayloadAction<LoginSuccessPayload>) {
            const n = normalizeLogin(action.payload);
            state.isAuthenticated = true;
            state.accessToken = n.accessToken;
            state.roleNames = n.roleNames;
            state.email = n.email;
            state.fullName = n.fullName;
            state.id = n.id;
            // nếu state có avatar:
            // (state as any).avatar = n.avatar;
        },
        setAccessToken(state: IAuthState, action: PayloadAction<string>) {
            state.accessToken = action.payload || "";
            state.isAuthenticated = !!action.payload;
        },
        logOut() {
            return initialState;
        },
    },
});

const rootState = (state: IAppState) => state.auth;

export const getRole = createSelector(rootState, (s: IAuthState) => s.roleNames || []);
export const getAccessToken = createSelector(rootState, (s: IAuthState) => s.accessToken);
export const isUserAuthenticated = createSelector(rootState, (s: IAuthState) => s.isAuthenticated);
export const getName = createSelector(rootState, (s: IAuthState) => s.fullName);
export const getEmail = createSelector(rootState, (s: IAuthState) => s.email);
export const getId = createSelector(rootState, (s: IAuthState) => s.id);

export const {updateRole, logOut, loginSuccess, setAccessToken} = authReducer.actions;
export default authReducer.reducer;
