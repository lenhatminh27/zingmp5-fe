import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useArtists } from "../../hooks/useArtists";
import { useAlbums } from "../../hooks/useAlbums";
import type { IArtist } from "../../types/model.type";
import type { AxiosError } from "axios";
import { getErrorMessage } from "../../utils/helpers";

const UploadAlbumPage: React.FC = () => {
    const navigate = useNavigate();
    const { createAlbum, isLoading } = useAlbums();
    const { getArtists } = useArtists();

    const [artists, setArtists] = useState<IArtist[]>([]);
    const [title, setTitle] = useState("");
    const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
    const [status, setStatus] = useState("published");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const imageInputRef = useRef<HTMLInputElement>(null);

    // Load artists
    useEffect(() => {
        const loadData = async () => {
            try {
                const artistsData = await getArtists();
                setArtists(Array.isArray(artistsData) ? artistsData : []);
            } catch (e) {
                getErrorMessage(e as AxiosError);
            }
        };
        loadData();
    }, []);

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
            if (file.type.startsWith("image/")) {
                handleImageFile(file);
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Vui lòng nhập tên album");
            return;
        }

        if (selectedArtists.length === 0) {
            alert("Vui lòng chọn ít nhất 1 nghệ sĩ");
            return;
        }

        try {
            const payload = {
                title: title.trim(),
                artist: selectedArtists,
                status: status,
            };

            await createAlbum(payload, {
                image: imageFile,
            });

            alert("Tạo album thành công!");
            navigate("/my-uploads");
        } catch (error) {
            console.error("Error creating album:", error);
        }
    };

    // Cleanup preview URLs
    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Create an album</h1>
                    <p className="text-neutral-400">Group your tracks together</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Album Cover Image */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-neutral-300">
                            Album Cover (Optional)
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
                            {imagePreview ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center">
                                        <img
                                            src={imagePreview}
                                            alt="Album cover"
                                            className="w-48 h-48 object-cover rounded-lg border border-neutral-700"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{imageFile?.name}</p>
                                        <p className="text-sm text-neutral-400 mt-1">
                                            {imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : ""}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            if (imagePreview) {
                                                URL.revokeObjectURL(imagePreview);
                                                setImagePreview(null);
                                            }
                                        }}
                                        className="text-sm text-red-400 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-5xl text-neutral-500">🖼️</div>
                                    <div>
                                        <p className="text-neutral-300 mb-2">
                                            Drag and drop your image here, or
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => imageInputRef.current?.click()}
                                            className="text-[#1DB954] hover:text-[#1ed760] font-medium"
                                        >
                                            browse files
                                        </button>
                                    </div>
                                    <p className="text-xs text-neutral-500">
                                        JPG, PNG, or GIF (max 10MB)
                                    </p>
                                </div>
                            )}
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
                            Album Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter album title"
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

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1DB954]"
                        >
                            <option value="published">Published</option>
                            <option value="private">Private</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

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
                                    Creating...
                                </span>
                            ) : (
                                "Create Album"
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

export default UploadAlbumPage;

