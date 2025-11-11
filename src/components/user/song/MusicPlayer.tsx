import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {nextTrack, playPause, prevTrack, selectPlayer} from "../../../store/reducers/player.ts";
import {formatDuration, getArtistNames} from "../../../utils/helpers.ts";
import type {IArtist} from "../../../types/model.type.ts";

const MusicPlayer: React.FC = () => {
    const dispatch = useDispatch();
    const {currentSong, isPlaying} = useSelector(selectPlayer);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Effect để xử lý play/pause
    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(error => console.error("Audio play failed:", error));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentSong]);

    // Effect để thay đổi source audio khi bài hát thay đổi
    useEffect(() => {
        if (audioRef.current && currentSong) {
            audioRef.current.src = currentSong.file_path || '';
            // Tải và phát bài hát mới
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(error => console.error("Audio play failed:", error));
            }
        }
    }, [currentSong]);

    if (!currentSong) {
        return null; // Ẩn player nếu không có bài hát nào
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
            setCurrentTime(Number(e.target.value));
        }
    };

    const artistNames = getArtistNames(currentSong.artists as IArtist[]);
    const cover = currentSong.image || "https://via.placeholder.com/64";

    return (
        <div
            className="fixed bottom-0 left-0 right-0 h-20 bg-[#181818] border-t border-neutral-800 text-white flex items-center px-4 z-50">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => dispatch(nextTrack())}
            />

            {/* Track Info */}
            <div className="flex items-center gap-3 w-1/4">
                <img src={cover} alt={currentSong.title} className="w-14 h-14 rounded-md"/>
                <div>
                    <h4 className="hidden md:flex font-semibold truncate">{currentSong.title}</h4>
                    <p className="hidden md:flex text-xs text-neutral-400 truncate">{artistNames}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center justify-center flex-1 w-1/2">
                <div className="flex items-center gap-4">
                    <button onClick={() => dispatch(prevTrack())} className="text-neutral-400 hover:text-white">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 5h3v10H4V5zm12 0v10l-9-5 9-5z"/>
                        </svg>
                    </button>
                    <button onClick={() => dispatch(playPause())}
                            className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center">
                        {isPlaying ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 4l10 6-10 6V4z"/>
                            </svg>
                        )}
                    </button>
                    <button onClick={() => dispatch(nextTrack())} className="text-neutral-400 hover:text-white">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 5h3v10h-3V5zM4 15l9-5-9-5v10z"/>
                        </svg>
                    </button>
                </div>
                {/* Progress Bar */}
                <div className="w-full flex items-center gap-2 text-xs text-neutral-400 mt-1">
                    <span>{formatDuration(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer range-sm"
                    />
                    <span>{formatDuration(duration)}</span>
                </div>
            </div>

            {/* Volume & Other Actions (Placeholder) */}
            <div className="w-1/4">
                {/* Volume control can be added here */}
            </div>
        </div>
    );
};

export default MusicPlayer;