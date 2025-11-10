import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSongs } from "../../hooks/useSongs";
import { useArtists } from "../../hooks/useArtists";
import { useGenres } from "../../hooks/useGenres";
import { useAlbums } from "../../hooks/useAlbums";
import type { IArtist, IGenre, IAlbum, ISong } from "../../types/model.type";
import type { AxiosError } from "axios";
import { getErrorMessage } from "../../utils/helpers";

// Helper function to get audio duration
const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        const url = URL.createObjectURL(file);
        audio.addEventListener("loadedmetadata", () => {
            URL.revokeObjectURL(url);
            resolve(audio.duration);
        });
        audio.addEventListener("error", (e) => {
            URL.revokeObjectURL(url);
            reject(e);
        });
        audio.src = url;
    });
};

// Format duration to seconds
const formatDuration = (seconds: number): number => {
    return Math.round(seconds);
};

const UploadSongPage: React.FC = () => {
    const navigate = useNavigate();
    const { createSong, uploadProgress, isLoading } = useSongs();
    const { getArtists } = useArtists();
    const { getGenres } = useGenres();
    const { getAlbums } = useAlbums();

    const [artists, setArtists] = useState<IArtist[]>([]);
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [albums, setAlbums] = useState<IAlbum[]>([]);

    const [title, setTitle] = useState("");
    const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<string>("");
    const [lyric, setLyric] = useState("");
    const [policy, setPolicy] = useState("");
    const [duration, setDuration] = useState<number>(0);

    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [audioPreview, setAudioPreview] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Load artists, genres, and albums
    useEffect(() => {
        const loadData = async () => {
            try {
                const [artistsData, genresData, albumsData] = await Promise.all([
                    getArtists(),
                    getGenres(),
                    getAlbums(),
                ]);
                setArtists(Array.isArray(artistsData) ? artistsData : []);
                setGenres(Array.isArray(genresData) ? genresData : []);
                setAlbums(Array.isArray(albumsData) ? albumsData : []);
            } catch (e) {
                getErrorMessage(e as AxiosError);
            }
        };
        loadData();
    }, []);

    // Handle audio file selection
    const handleAudioFile = async (file: File) => {
        if (!file.type.startsWith("audio/")) {
            alert("Vui lòng chọn file audio hợp lệ");
            return;
        }
        setAudioFile(file);
        const previewUrl = URL.createObjectURL(file);
        setAudioPreview(previewUrl);
        try {
            const dur = await getAudioDuration(file);
            setDuration(formatDuration(dur));
        } catch (error) {
            console.error("Error getting audio duration:", error);
        }
    };

    // Handle image file selection
    const handleImageFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn file ảnh hợp lệ");
            return;
        }
        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    // Drag and drop handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("audio/")) {
                handleAudioFile(file);
            } else if (file.type.startsWith("image/")) {
                handleImageFile(file);
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Vui lòng nhập tên bài hát");
            return;
        }

        if (!audioFile) {
            alert("Vui lòng chọn file audio");
            return;
        }

        if (duration <= 0) {
            alert("Không thể xác định thời lượng bài hát");
            return;
        }

        if (selectedArtists.length === 0) {
            alert("Vui lòng chọn ít nhất 1 nghệ sĩ");
            return;
        }

        if (selectedGenres.length === 0) {
            alert("Vui lòng chọn ít nhất 1 thể loại");
            return;
        }

        try {
            const payload: Omit<ISong, "_id" | "slug" | "likes" | "views" | "liked_by"> = {
                title: title.trim(),
                duration,
                artists: selectedArtists,
                genres: selectedGenres,
                album_id: selectedAlbum || undefined,
                lyric: lyric.trim() || undefined,
                policy: policy.trim() || undefined,
            };

            await createSong(
                payload,
                {
                    image: imageFile,
                    file_path: audioFile,
                },
                (progress) => {
                    console.log(`Upload progress: ${progress}%`);
                }
            );

            alert("Upload bài hát thành công!");
            navigate("/");
        } catch (error) {
            console.error("Error uploading song:", error);
        }
    };

    // Cleanup preview URLs
    useEffect(() => {
        return () => {
            if (audioPreview) URL.revokeObjectURL(audioPreview);
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [audioPreview, imagePreview]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Upload your track</h1>
                    <p className="text-neutral-400">Share your music with the world</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Audio File Upload */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-neutral-300">
                            Audio File <span className="text-red-400">*</span>
                        </label>
                        <div
                            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                ? "border-[#1DB954] bg-[#1DB954]/10"
                                : "border-neutral-700 bg-[#111] hover:border-neutral-600"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {audioFile ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center">
                                        <div className="text-[#1DB954] text-4xl">🎵</div>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{audioFile.name}</p>
                                        <p className="text-sm text-neutral-400 mt-1">
                                            {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        {duration > 0 && (
                                            <p className="text-sm text-neutral-400">
                                                Duration: {Math.floor(duration / 60)}:
                                                {String(duration % 60).padStart(2, "0")}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAudioFile(null);
                                            if (audioPreview) {
                                                URL.revokeObjectURL(audioPreview);
                                                setAudioPreview(null);
                                            }
                                        }}
                                        className="text-sm text-red-400 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-5xl text-neutral-500">📁</div>
                                    <div>
                                        <p className="text-neutral-300 mb-2">
                                            Drag and drop your audio file here, or
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => audioInputRef.current?.click()}
                                            className="text-[#1DB954] hover:text-[#1ed760] font-medium"
                                        >
                                            browse files
                                        </button>
                                    </div>
                                    <p className="text-xs text-neutral-500">
                                        MP3, WAV, FLAC, or other audio formats
                                    </p>
                                </div>
                            )}
                            <input
                                ref={audioInputRef}
                                type="file"
                                accept="audio/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleAudioFile(e.target.files[0]);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-neutral-300">
                            Cover Image (Optional)
                        </label>
                        <div className="flex items-center gap-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Cover"
                                        className="w-32 h-32 object-cover rounded-lg border border-neutral-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            if (imagePreview) {
                                                URL.revokeObjectURL(imagePreview);
                                                setImagePreview(null);
                                            }
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => imageInputRef.current?.click()}
                                    className="w-32 h-32 border-2 border-dashed border-neutral-700 rounded-lg flex items-center justify-center hover:border-neutral-600 transition-colors"
                                >
                                    <span className="text-2xl">🖼️</span>
                                </button>
                            )}
                            <div>
                                <button
                                    type="button"
                                    onClick={() => imageInputRef.current?.click()}
                                    className="text-sm text-[#1DB954] hover:text-[#1ed760]"
                                >
                                    {imagePreview ? "Change image" : "Upload image"}
                                </button>
                                <p className="text-xs text-neutral-500 mt-1">
                                    JPG, PNG, or GIF (max 10MB)
                                </p>
                            </div>
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleImageFile(e.target.files[0]);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter track title"
                            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#1DB954]"
                            required
                        />
                    </div>

                    {/* Artists */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">
                            Artists <span className="text-red-400">*</span>
                        </label>

                        {/* Selected Artists Tags */}
                        {selectedArtists.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 bg-[#1a1a1a] border border-neutral-700 rounded-lg">
                                {selectedArtists.map((artistId) => {
                                    const artist = artists.find((a) => a._id === artistId);
                                    return artist ? (
                                        <span
                                            key={artistId}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#1DB954] text-black rounded-full text-sm font-medium"
                                        >
                                            {artist.stageName}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedArtists((prev) =>
                                                        prev.filter((id) => id !== artistId)
                                                    )
                                                }
                                                className="hover:text-red-600"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        )}

                        {/* Artist Selector */}
                        <div className="relative">
                            <select
                                value=""
                                onChange={(e) => {
                                    if (e.target.value && !selectedArtists.includes(e.target.value)) {
                                        setSelectedArtists([...selectedArtists, e.target.value]);
                                    }
                                }}
                                className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1DB954]"
                            >
                                <option value="">Select an artist...</option>
                                {artists
                                    .filter((artist) => !selectedArtists.includes(artist._id))
                                    .map((artist) => (
                                        <option key={artist._id} value={artist._id}>
                                            {artist.stageName}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <p className="text-xs text-neutral-500">
                            Select one or more artists from the dropdown
                        </p>
                    </div>

                    {/* Genres */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">
                            Genres <span className="text-red-400">*</span>
                        </label>

                        {/* Selected Genres Tags */}
                        {selectedGenres.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 bg-[#1a1a1a] border border-neutral-700 rounded-lg">
                                {selectedGenres.map((genreId) => {
                                    const genre = genres.find((g) => g._id === genreId);
                                    return genre ? (
                                        <span
                                            key={genreId}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#3ea6c1] text-black rounded-full text-sm font-medium"
                                        >
                                            {genre.name}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedGenres((prev) =>
                                                        prev.filter((id) => id !== genreId)
                                                    )
                                                }
                                                className="hover:text-red-600"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        )}

                        {/* Genre Selector */}
                        <div className="relative">
                            <select
                                value=""
                                onChange={(e) => {
                                    if (e.target.value && !selectedGenres.includes(e.target.value)) {
                                        setSelectedGenres([...selectedGenres, e.target.value]);
                                    }
                                }}
                                className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1DB954]"
                            >
                                <option value="">Select a genre...</option>
                                {genres
                                    .filter((genre) => !selectedGenres.includes(genre._id))
                                    .map((genre) => (
                                        <option key={genre._id} value={genre._id}>
                                            {genre.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <p className="text-xs text-neutral-500">
                            Select one or more genres from the dropdown
                        </p>
                    </div>

                    {/* Album */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">
                            Album (Optional)
                        </label>
                        <select
                            value={selectedAlbum}
                            onChange={(e) => setSelectedAlbum(e.target.value)}
                            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1DB954]"
                        >
                            <option value="">None</option>
                            {albums.map((album) => (
                                <option key={album._id} value={album._id}>
                                    {album.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lyric */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">Lyrics (Optional)</label>
                        <textarea
                            value={lyric}
                            onChange={(e) => setLyric(e.target.value)}
                            placeholder="Enter lyrics"
                            rows={6}
                            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#1DB954] resize-none"
                        />
                    </div>

                    {/* Policy */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">
                            Policy (Optional)
                        </label>
                        <input
                            type="text"
                            value={policy}
                            onChange={(e) => setPolicy(e.target.value)}
                            placeholder="Enter policy"
                            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#1DB954]"
                        />
                    </div>

                    {/* Upload Progress */}
                    {isLoading && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-300">Uploading...</span>
                                {uploadProgress > 0 && (
                                    <span className="text-[#1DB954]">{uploadProgress}%</span>
                                )}
                            </div>
                            <div className="w-full bg-neutral-800 rounded-full h-2">
                                <div
                                    className="bg-[#1DB954] h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex-1 py-4 px-6 rounded-full font-semibold text-black transition-all ${isLoading
                                ? "bg-neutral-600 cursor-not-allowed"
                                : "bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105"
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Uploading...
                                </span>
                            ) : (
                                "Upload Track"
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-4 border border-neutral-700 rounded-full font-semibold hover:border-neutral-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadSongPage;

