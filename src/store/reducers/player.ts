import {createSelector, createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {ISong} from '../../types/model.type';
import type {IAppState} from "../store.ts";

export interface IPlayerState {
    queue: ISong[];
    currentSong: ISong | null;
    currentIndex: number;
    isPlaying: boolean;
    volume: number; // 0 to 1
}

const initialState: IPlayerState = {
    queue: [],
    currentSong: null,
    currentIndex: -1,
    isPlaying: false,
    volume: 0.75,
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        // Action chính để bắt đầu phát một danh sách nhạc
        startPlaying: (state, action: PayloadAction<{ songs: ISong[], index: number }>) => {
            const {songs, index} = action.payload;
            state.queue = songs;
            state.currentIndex = index;
            state.currentSong = songs[index];
            state.isPlaying = true;
        },
        // Action để play/pause
        playPause: (state) => {
            if (state.currentSong) {
                state.isPlaying = !state.isPlaying;
            }
        },
        // Action để chuyển bài kế tiếp
        nextTrack: (state) => {
            if (state.currentSong) {
                const nextIndex = (state.currentIndex + 1) % state.queue.length;
                state.currentIndex = nextIndex;
                state.currentSong = state.queue[nextIndex];
                state.isPlaying = true;
            }
        },
        // Action để quay lại bài trước
        prevTrack: (state) => {
            if (state.currentSong) {
                const prevIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
                state.currentIndex = prevIndex;
                state.currentSong = state.queue[prevIndex];
                state.isPlaying = true;
            }
        },
        // Action để đặt lại state khi không còn phát nữa
        stopPlaying: (state) => {
            Object.assign(state, initialState);
        },
    },
});

export const {startPlaying, playPause, nextTrack, prevTrack, stopPlaying} = playerSlice.actions;

const rootState = (state: IAppState) => state.player;
export const selectPlayer = createSelector(rootState, (s: IPlayerState) => s)

export default playerSlice.reducer;