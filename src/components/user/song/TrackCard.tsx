import React from "react";
import type {ISong} from "../../../types/model.type";
import {formatDuration, getArtistNames} from "../../../utils/helpers";

type Props = {
    song: ISong;
    onPlay?: (song: ISong) => void;
    onMore?: (song: ISong) => void;
};

const TrackCard: React.FC<Props> = ({song, onPlay, onMore}) => {
    const cover =
        song.image ||
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><rect width='100%' height='100%' fill='%231a1a1a'/></svg>";

    const artistNames = getArtistNames(song.artists as any);
    console.log(onMore)

    return (
        <article
            className="group overflow-hidden rounded-2xl border border-[#262626] bg-[#111]/60 hover:bg-[#151515] transition-colors">
            {/* Cover */}
            <div className="relative aspect-square w-full bg-[#1a1a1a]">
                <img
                    src={cover}
                    alt={song.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                />

                {/* Play on hover */}
                <button
                    className="absolute bottom-1/2 right-1/2 translate-x-[50%] translate-y-[50%] flex items-center justify-center h-14 w-14 rounded-full text-black font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{background: "linear-gradient(90deg,#1DB954,#3ea6c1)"}}
                    onClick={() => onPlay?.(song)}
                    aria-label="Play"
                    title="Play"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"></path>
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="p-3">
                <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-xs text-neutral-400">{artistNames}</div>
                        <h3 className="truncate text-sm font-semibold">{song.title}</h3>
                    </div>

                </div>


                {/* Stats */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
                    <div className="flex items-center gap-2">
                        <span>▶ {(song.views ?? 0).toLocaleString()}</span>
                        <span>❤ {(song.likes ?? 0).toLocaleString()}</span>
                    </div>
                    <span className="tabular-nums">{formatDuration(song.duration)}</span>
                </div>
            </div>
        </article>
    );
};

export default TrackCard;