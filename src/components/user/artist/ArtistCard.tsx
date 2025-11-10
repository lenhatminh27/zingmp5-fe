import React from 'react';
import type {IArtist} from "../../../types/model.type.ts";

type Props = {
    artist: IArtist;
};

const ArtistCard: React.FC<Props> = ({artist}) => {
    const avatar = artist.avatarUrl || `https://via.placeholder.com/48/1a1a1a/ffffff?text=${artist.stageName[0]}`;

    return (
        <div className="flex items-center justify-between p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <div className="flex items-center gap-3 min-w-0">
                <img
                    src={avatar}
                    alt={artist.stageName}
                    className="w-12 h-12 rounded-full object-cover bg-neutral-700"
                    loading="lazy"
                />
                <div className="min-w-0">
                    <h5 className="font-semibold truncate">{artist.stageName}</h5>
                    <p className="text-xs text-neutral-400">
                        {(artist.followerCount ?? 0).toLocaleString()} followers
                    </p>
                </div>
            </div>
            <button
                className="shrink-0 ml-2 px-3 py-1 text-xs font-semibold border border-neutral-600 rounded-full hover:border-white transition-colors">
                Follow
            </button>
        </div>
    );
};

export default ArtistCard;