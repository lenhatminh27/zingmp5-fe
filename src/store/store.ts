import {type PersistConfig, persistReducer, persistStore} from "redux-persist";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import {combineReducers} from "redux";
import authReducer from "./reducers/auth.ts";
import type {IPlayerState} from "./reducers/player.ts";
import playerReducer from './reducers/player.ts';
import {configureStore} from "@reduxjs/toolkit";
import localStorage from "redux-persist/lib/storage";

export interface IAuthState {
    id?: string;
    email: string;
    fullName: string;
    roleNames: string[];
    isAuthenticated: boolean;
    accessToken: string;
}

export interface IAppState {
    auth: IAuthState;
    player: IPlayerState
}

const persistConfig: PersistConfig<IAppState> = {
    key: "root",
    storage: localStorage,
    blacklist: [],
    stateReconciler: autoMergeLevel2,
};

const rootReducers = combineReducers({
    auth: authReducer,
    player: playerReducer
});

export const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducers),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
