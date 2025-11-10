import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSongs } from "../../hooks/useSongs";
import { useArtists } from "../../hooks/useArtists";
import { useGenres } from "../../hooks/useGenres";
import { useAlbums } from "../../hooks/useAlbums";
import type { IArtist, IGenre, IAlbum, ISong } from "../../types/model.type";
import type { AxiosError } from "axios";
import { getErrorMessage } from "../../utils/helpers";

const EditSongPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getSong, updateSong, uploadProgress, isLoading } = useSongs();
    const { getArtists } = useArtists();
    const { getGenres } = useGenres();
    const { getAlbums } = useAlbums();

    const [artists, setArtists] = useState<IArtist[]>([]);
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [albums, setAlbums] = useState<IAlbum[]>([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<string>("");
    const [lyric, setLyric] = useState("");
    const [policy, setPolicy] = useState("");
    const [duration, setDuration] = useState<number>(0);

    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Load data
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

                // Load song data
                if (id) {
                    const songData = await getSong(id);
                    if (songData) {
                        setTitle(songData.title);
                        setDuration(songData.duration);
                        setLyric(songData.lyric || "");
                        setPolicy(songData.policy || "");
                        setImagePreview(songData.image || null);

                        // Extract IDs from artists/genres
                        const artistIds = songData.artists.map((a) =>
                            typeof a === "object" ? a._id : a
                        );
                        const genreIds = songData.genres.map((g) =>
                            typeof g === "object" ? g._id : g
                        );
                        setSelectedArtists(artistIds);
                        setSelectedGenres(genreIds);

                        if (songData.album_id) {
                            const albumId = typeof songData.album_id === "object"
                                ? songData.album_id._id
                                : songData.album_id;
                            setSelectedAlbum(albumId);
                        }
                    }
                }
            } catch (e) {
                getErrorMessage(e as AxiosError);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleImageFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn file ảnh hợp lệ");
            return;
        }
        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Vui lòng nhập tên bài hát");
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

        if (!id) return;

        try {
            const payload: Partial<ISong> = {
                title: title.trim(),
                duration,
                artists: selectedArtists as any,
                genres: selectedGenres as any,
                album_id: selectedAlbum || undefined,
                lyric: lyric.trim() || undefined,
                policy: policy.trim() || undefined,
            };

            await updateSong(
                id,
                payload,
                {
                    image: imageFile,
                    file_path: audioFile,
                }
            );

            alert("Cập nhật bài hát thành công!");
            navigate("/my-uploads");
        } catch (error) {
            console.error("Error updating song:", error);
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview && imageFile) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview, imageFile]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">🎵</div>
                    <p className="text-neutral-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Edit track</h1>
                    <p className="text-neutral-400">Update your track information</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
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
                                    {imageFile && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageFile(null);
                                                if (imagePreview && imageFile) {
                                                    URL.revokeObjectURL(imagePreview);
                                                }
                                                setImagePreview(null);
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    )}
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

                    {/* Replace Audio (Optional) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">
                            Replace Audio File (Optional)
                        </label>
                        {audioFile && (
                            <div className="p-3 bg-[#1a1a1a] border border-neutral-700 rounded-lg">
                                <p className="text-sm text-white">{audioFile.name}</p>
                                <button
                                    type="button"
                                    onClick={() => setAudioFile(null)}
                                    className="text-xs text-red-400 hover:text-red-300 mt-1"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => audioInputRef.current?.click()}
                            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm transition-colors"
                        >
                            {audioFile ? "Change Audio" : "Upload New Audio"}
                        </button>
                        <input
                            ref={audioInputRef}
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setAudioFile(e.target.files[0]);
                                }
                            }}
                        />
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

                    {/* Artists - Same as UploadSongPage */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">
                            Artists <span className="text-red-400">*</span>
                        </label>
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

                    {/* Genres - Same as UploadSongPage */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">
                            Genres <span className="text-red-400">*</span>
                        </label>
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
                        <label className="block text-sm font-medium text-neutral-300">
                            Lyrics (Optional)
                        </label>
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
                                <span className="text-neutral-300">Updating...</span>
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
                            {isLoading ? "Updating..." : "Update Track"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/my-uploads")}
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

export default EditSongPage;

