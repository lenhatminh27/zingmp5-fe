import React from 'react';
import type {IAlbum} from '../../../types/model.type';
import {Link} from 'react-router-dom';

type Props = {
    album: IAlbum;
};

const AlbumCard: React.FC<Props> = ({album}) => {
    const cover = album.image || `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><rect width='100%' height='100%' fill='%231a1a1a'/></svg>`;

    return (
        <Link to={`/album/${album._id}`} className="block group">
            <article className="overflow-hidden rounded-lg transition-colors">
                <div className="relative aspect-square w-full bg-[#1a1a1a]">
                    <img
                        src={cover}
                        alt={album.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                    />
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="mt-2">
                    <h3 className="truncate font-semibold text-sm text-white">{album.title}</h3>
                    <p className="truncate text-xs text-neutral-400">Album</p>
                </div>
            </article>
        </Link>
    );
};

export default AlbumCard;