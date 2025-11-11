import React, { useEffect, useState } from 'react';
import { useArtists } from "../../../hooks/useArtists.ts";
import type { IArtist } from "../../../types/model.type.ts";
import { getErrorMessage } from "../../../utils/helpers.ts";
import type { AxiosError } from 'axios';
import ArtistCard from '../artist/ArtistCard';

const ArtistSidebar: React.FC = () => {
    const { getArtists, isLoading } = useArtists();
    const [suggestedArtists, setSuggestedArtists] = useState<IArtist[]>([]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const data = await getArtists();
                if (Array.isArray(data)) {
                    setSuggestedArtists(data.slice(0, 5));
                }
            } catch (e) {
                getErrorMessage(e as AxiosError);
            }
        };

        fetchArtists();
    }, []);

    const Skeleton = () => (
        <div className="flex items-center gap-3 p-2 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-neutral-700" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-700 rounded w-3/4" />
                <div className="h-3 bg-neutral-700 rounded w-1/2" />
            </div>
        </div>
    );

    return (
        // `hidden lg:block` để ẩn sidebar trên màn hình nhỏ
        <aside className="hidden lg:block w-90 shrink-0 p-4 space-y-4">
            <div className="bg-[#181818] rounded-xl p-4">
                <h3 className="font-bold text-white mb-4">Popular Artists</h3>

                <div className="space-y-2">
                    {isLoading && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)}

                    {!isLoading && suggestedArtists.map(artist => (
                        <ArtistCard key={artist._id} artist={artist} />
                    ))}
                </div>

                <a href="#" className="block text-center text-sm font-semibold text-neutral-300 mt-4 hover:text-white">
                    Find more artists
                </a>
            </div>

            {/* Bạn có thể thêm các widget khác ở đây, ví dụ: Likes, History... */}
        </aside>
    );
};

export default ArtistSidebar;