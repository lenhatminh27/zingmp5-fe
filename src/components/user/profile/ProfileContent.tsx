import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import type { IArtist, ISong, IAlbum } from "../../../types/model.type.ts";
import { useArtists } from '../../../hooks/useArtists';
import { formatDuration } from '../../../utils/helpers';
import { getArtistNames } from '../../../utils/helpers';

type Props = {
    artist: IArtist;
};

const ProfileContent: React.FC<Props> = ({ artist }) => {
    const [activeTab, setActiveTab] = useState('tracks');
    const [songs, setSongs] = useState<ISong[]>([]);
    const [albums, setAlbums] = useState<IAlbum[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { getArtistSongs, getArtistAlbums } = useArtists();

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const [songsData, albumsData] = await Promise.all([
                    getArtistSongs(artist._id),
                    getArtistAlbums(artist._id),
                ]);
                setSongs(songsData || []);
                setAlbums(albumsData || []);
            } catch (error) {
                console.error('Error fetching artist data:', error);
                setSongs([]);
                setAlbums([]);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [artist._id]);

    const TabButton: React.FC<{ tabName: string; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 font-semibold border-b-2 ${activeTab === tabName
                ? 'border-green-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="px-6 mt-6">
            <div className="border-b border-neutral-800">
                <TabButton tabName="tracks" label="Tracks" />
                <TabButton tabName="albums" label="Albums" />
            </div>

            <Spin spinning={isLoading}>
                <div className="mt-6">
                    {activeTab === 'tracks' && (
                        <div>
                            <h3 className="text-xl font-bold mb-4">Latest Tracks</h3>
                            {songs && songs.length > 0 ? (
                                <div className="space-y-2">
                                    {songs.map((song) => (
                                        <Link
                                            key={song._id}
                                            to={`/song/${song._id}`}
                                            className="block p-3 rounded hover:bg-neutral-900 transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-white">{song.title}</p>
                                                    <p className="text-sm text-neutral-400">{getArtistNames(song.artists || [])}</p>
                                                </div>
                                                <p className="text-sm text-neutral-400">{formatDuration(song.duration || 0)}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-neutral-500">This artist hasn't uploaded any tracks yet.</p>
                            )}
                        </div>
                    )}
                    {activeTab === 'albums' && (
                        <div>
                            <h3 className="text-xl font-bold mb-4">Albums</h3>
                            {albums && albums.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {albums.map((album) => (
                                        <Link
                                            key={album._id}
                                            to={`/album/${album._id}`}
                                            className="group cursor-pointer"
                                        >
                                            <div className="bg-neutral-900 rounded overflow-hidden mb-2 relative">
                                                <img
                                                    src={album.image}
                                                    alt={album.title}
                                                    className="w-full aspect-square object-cover group-hover:opacity-80 transition-opacity"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-white truncate group-hover:text-green-500 transition-colors">{album.title}</p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-neutral-500">This artist hasn't created any albums yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </Spin>
        </div>
    );
};

export default ProfileContent;