import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAlbums } from '../../hooks/useAlbums';
import type { IAlbum, ISong } from '../../types/model.type';
import { Alert, Button, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { startPlaying } from '../../store/reducers/player';
import { formatDuration, getArtistNames } from '../../utils/helpers';
import type { AxiosError } from 'axios';
import { getErrorMessage } from '../../utils/helpers';

const AlbumDetailPage: React.FC = () => {
    const { albumId } = useParams<{ albumId: string }>();
    const { getAlbum, getAlbumSongs } = useAlbums();
    const dispatch = useDispatch();

    const [album, setAlbum] = useState<IAlbum | null>(null);
    const [songs, setSongs] = useState<ISong[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!albumId) return;
        (async () => {
            try {
                const albumData = await getAlbum(albumId);
                setAlbum(albumData);
            } catch (e) {
                getErrorMessage(e as AxiosError);
                setError('Không tìm thấy album');
            } finally {
                setIsLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [albumId]);

    useEffect(() => {
        if (!albumId) return;
        (async () => {
            try {
                const songsData = await getAlbumSongs(albumId);
                console.log('Album Songs Response:', songsData);

                // Handle both direct array and nested data structure
                let processedSongs: ISong[] = [];
                if (Array.isArray(songsData)) {
                    processedSongs = songsData;
                } else if (songsData && typeof songsData === 'object' && 'data' in songsData) {
                    processedSongs = Array.isArray((songsData as Record<string, unknown>).data) ? (songsData as Record<string, unknown>).data as ISong[] : [];
                }

                // Ensure each song has required fields for player
                const validSongs = processedSongs.map((song: ISong) => ({
                    ...song,
                    _id: song._id,
                    title: song.title || 'Unknown',
                    duration: song.duration || 0,
                    file_path: song.file_path || '',
                    image: song.image || '',
                    slug: song.slug || '',
                    artists: song.artists || [],
                    genres: song.genres || [],
                }));

                console.log('Processed Songs:', validSongs);
                setSongs(validSongs);
            } catch (e) {
                console.error('Error fetching songs:', e);
                getErrorMessage(e as AxiosError);
                setSongs([]);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [albumId]);

    const handlePlayAlbum = () => {
        if (songs.length > 0) {
            dispatch(startPlaying({ songs, index: 0 }));
        }
    };

    const handlePlayTrack = (trackIndex: number) => {
        dispatch(startPlaying({ songs, index: trackIndex }));
    };

    if (isLoading) return <div className="text-center p-10"><Spin size="large" /></div>;
    if (error) return <div className="p-10"><Alert message="Error" description={error} type="error" showIcon /></div>;
    if (!album) return null;

    return (
        <div className="space-y-8">
            {/* Album Header */}
            <div className="flex flex-col md:flex-row gap-8 p-8 bg-neutral-900 rounded-lg">
                <img src={album.image} alt={album.title}
                    className="w-full md:w-56 md:h-56 h-auto object-cover rounded-md shadow-lg" />
                <div className="flex flex-col justify-end">
                    <p className="font-semibold">Album</p>
                    <h1 className="text-5xl font-extrabold">{album.title}</h1>
                    <p className="mt-2 text-neutral-300">
                        By Artist {album.artist.join(', ')} • {songs.length} songs
                    </p>
                    <Button type="primary" size="large" onClick={handlePlayAlbum} className="mt-4 w-32">
                        Play
                    </Button>
                </div>
            </div>

            {/* Track List */}
            <div className="px-8">
                {songs.map((song, index) => (
                    <div key={song._id}
                        className="group flex items-center p-2 rounded-md hover:bg-neutral-800 transition-colors">
                        <div className="w-8 text-neutral-400 text-center">{index + 1}</div>
                        <button onClick={() => handlePlayTrack(index)}
                            className="mx-4 text-white opacity-0 group-hover:opacity-100">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"></path>
                            </svg>
                        </button>
                        <div className="flex-1">
                            <Link
                                to={`/song/${song._id}`}
                                className="font-semibold hover:underline"
                            >
                                {song.title}
                            </Link>
                            <p className="text-sm text-neutral-400">{getArtistNames(song.artists.map((artist: IArtist) => artist.stageName) || [])}</p>
                        </div>
                        <div className="w-24 text-neutral-400 text-right">{formatDuration(song.duration)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlbumDetailPage;
