import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSongs } from "../../hooks/useSongs";
import { useAlbums } from "../../hooks/useAlbums";
import type { ISong, IAlbum } from "../../types/model.type";
import type { AxiosError } from "axios";
import { getErrorMessage, getArtistNames } from "../../utils/helpers";
import { useSelector } from "react-redux";
import { getId } from "../../store/reducers/auth";

const MyUploadsPage: React.FC = () => {
    const navigate = useNavigate();
    const userId = useSelector(getId);
    const { getSongs, deleteSong, isLoading: songsLoading } = useSongs();
    const { getAlbums, deleteAlbum, isLoading: albumsLoading } = useAlbums();

    const [songs, setSongs] = useState<ISong[]>([]);
    const [albums, setAlbums] = useState<IAlbum[]>([]);
    const [activeTab, setActiveTab] = useState<"songs" | "albums">("songs");
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: "song" | "album"; id: string } | null>(null);

    // Load user's songs and albums
    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadData = async () => {
        try {
            console.log("[MyUploads] Loading data for user:", userId);
            const [songsData, albumsData] = await Promise.all([getSongs(), getAlbums()]);

            console.log("[MyUploads] All songs:", songsData);
            console.log("[MyUploads] All albums:", albumsData);

            // Filter songs created by current user
            const mySongs = (Array.isArray(songsData) ? songsData : []).filter(
                (song) => {
                    const match = song.created_by === userId;
                    console.log(`[MyUploads] Song "${song.title}" - created_by: ${song.created_by}, userId: ${userId}, match: ${match}`);
                    return match;
                }
            );
            setSongs(mySongs);

            // Filter albums created by current user
            const myAlbums = (Array.isArray(albumsData) ? albumsData : []).filter(
                (album) => {
                    const match = album.created_by === userId;
                    console.log(`[MyUploads] Album "${album.title}" - created_by: ${album.created_by}, userId: ${userId}, match: ${match}`);
                    return match;
                }
            );
            setAlbums(myAlbums);

            console.log("[MyUploads] Filtered songs:", mySongs.length, "albums:", myAlbums.length);
        } catch (e) {
            getErrorMessage(e as AxiosError);
            console.error("[MyUploads] Error loading data:", e);
        }
    };

    const handleDeleteSong = async (id: string) => {
        try {
            await deleteSong(id);
            setSongs((prev) => prev.filter((s) => s._id !== id));
            setDeleteConfirm(null);
            alert("Xóa bài hát thành công");
        } catch (error) {
            console.error("Error deleting song:", error);
        }
    };

    const handleDeleteAlbum = async (id: string) => {
        try {
            await deleteAlbum(id);
            setAlbums((prev) => prev.filter((a) => a._id !== id));
            setDeleteConfirm(null);
            alert("Xóa album thành công");
        } catch (error) {
            console.error("Error deleting album:", error);
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Uploads</h1>
                        <p className="text-neutral-400">Manage your tracks and albums</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to="/upload"
                            className="px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold rounded-full transition-colors"
                        >
                            + Upload Track
                        </Link>
                        <Link
                            to="/upload-album"
                            className="px-6 py-3 bg-[#3ea6c1] hover:bg-[#4fb6d1] text-black font-semibold rounded-full transition-colors"
                        >
                            + Create Album
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-neutral-800 mb-6">
                    <button
                        onClick={() => setActiveTab("songs")}
                        className={`pb-3 px-2 font-semibold transition-colors relative ${activeTab === "songs"
                            ? "text-[#1DB954]"
                            : "text-neutral-400 hover:text-white"
                            }`}
                    >
                        Tracks ({songs.length})
                        {activeTab === "songs" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1DB954]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("albums")}
                        className={`pb-3 px-2 font-semibold transition-colors relative ${activeTab === "albums"
                            ? "text-[#1DB954]"
                            : "text-neutral-400 hover:text-white"
                            }`}
                    >
                        Albums ({albums.length})
                        {activeTab === "albums" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1DB954]" />
                        )}
                    </button>
                </div>

                {/* Songs Tab */}
                {activeTab === "songs" && (
                    <div className="space-y-4">
                        {songsLoading ? (
                            <div className="text-center text-neutral-400 py-12">Loading...</div>
                        ) : songs.length === 0 ? (
                            <div className="text-center py-12 bg-[#111] border border-neutral-800 rounded-lg">
                                <div className="text-6xl mb-4">🎵</div>
                                <p className="text-neutral-400 mb-4">
                                    You haven't uploaded any tracks yet
                                </p>
                                <Link
                                    to="/upload"
                                    className="inline-block px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold rounded-full transition-colors"
                                >
                                    Upload Your First Track
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {songs.map((song) => (
                                    <div
                                        key={song._id}
                                        className="group bg-[#111] hover:bg-[#1a1a1a] border border-neutral-800 rounded-lg p-4 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Cover */}
                                            <div className="w-16 h-16 bg-neutral-800 rounded flex-shrink-0 overflow-hidden">
                                                {song.image ? (
                                                    <img
                                                        src={song.image}
                                                        alt={song.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl">
                                                        🎵
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-white truncate">
                                                    {song.title}
                                                </h3>
                                                <p className="text-sm text-neutral-400 truncate">
                                                    {getArtistNames(song.artists)}
                                                </p>
                                                <div className="flex gap-3 text-xs text-neutral-500 mt-1">
                                                    <span>{formatDuration(song.duration)}</span>
                                                    <span>•</span>
                                                    <span>{song.views || 0} plays</span>
                                                    <span>•</span>
                                                    <span>{song.likes || 0} likes</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => navigate(`/upload/${song._id}`)}
                                                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors"
                                                    title="Edit"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setDeleteConfirm({ type: "song", id: song._id })
                                                    }
                                                    className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-medium transition-colors"
                                                    title="Delete"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Albums Tab */}
                {activeTab === "albums" && (
                    <div className="space-y-4">
                        {albumsLoading ? (
                            <div className="text-center text-neutral-400 py-12">Loading...</div>
                        ) : albums.length === 0 ? (
                            <div className="text-center py-12 bg-[#111] border border-neutral-800 rounded-lg">
                                <div className="text-6xl mb-4">💿</div>
                                <p className="text-neutral-400 mb-4">
                                    You haven't created any albums yet
                                </p>
                                <Link
                                    to="/upload-album"
                                    className="inline-block px-6 py-3 bg-[#3ea6c1] hover:bg-[#4fb6d1] text-black font-semibold rounded-full transition-colors"
                                >
                                    Create Your First Album
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {albums.map((album) => (
                                    <div
                                        key={album._id}
                                        className="group bg-[#111] hover:bg-[#1a1a1a] border border-neutral-800 rounded-lg p-4 transition-all"
                                    >
                                        {/* Cover */}
                                        <div className="w-full aspect-square bg-neutral-800 rounded-lg mb-4 overflow-hidden">
                                            {album.image ? (
                                                <img
                                                    src={album.image}
                                                    alt={album.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-6xl">
                                                    💿
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <h3 className="font-semibold text-white truncate mb-1">
                                            {album.title}
                                        </h3>
                                        <p className="text-sm text-neutral-400 truncate mb-3">
                                            {album.songs?.length || 0} tracks
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => navigate(`/upload-album/${album._id}`)}
                                                className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setDeleteConfirm({ type: "album", id: album._id })
                                                }
                                                className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#1a1a1a] border border-neutral-700 rounded-2xl p-6 max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
                            <p className="text-neutral-300 mb-6">
                                Are you sure you want to delete this {deleteConfirm.type}? This action
                                cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        if (deleteConfirm.type === "song") {
                                            handleDeleteSong(deleteConfirm.id);
                                        } else {
                                            handleDeleteAlbum(deleteConfirm.id);
                                        }
                                    }}
                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyUploadsPage;

