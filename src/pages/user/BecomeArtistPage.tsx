import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useArtists } from "../../hooks/useArtists";
import { useGenres } from "../../hooks/useGenres";
import { getId } from "../../store/reducers/auth";
import type { IGenre } from "../../types/model.type";
import type { AxiosError } from "axios";
import { getErrorMessage } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import { logOut } from "../../store/reducers/auth.ts";

const BecomeArtistPage: React.FC = () => {
    const navigate = useNavigate();
    const userId = useSelector(getId);
    const { createArtist, isLoading } = useArtists();
    const { getGenres } = useGenres();
    const dispatch = useDispatch();

    const [genres, setGenres] = useState<IGenre[]>([]);
    const [stageName, setStageName] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [socialLinks, setSocialLinks] = useState({
        instagram: "",
        youtube: "",
        facebook: "",
        tiktok: "",
    });

    // Load genres
    useEffect(() => {
        const loadGenres = async () => {
            try {
                const genresData = await getGenres();
                setGenres(Array.isArray(genresData) ? genresData : []);
            } catch (e) {
                getErrorMessage(e as AxiosError);
            }
        };
        loadGenres();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stageName.trim()) {
            alert("Vui lòng nhập nghệ danh");
            return;
        }

        if (!userId) {
            alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return;
        }

        try {
            const payload = {
                userId,
                stageName: stageName.trim(),
                bio: bio.trim() || undefined,
                location: location.trim() || undefined,
                genreFocus: selectedGenres.length > 0 ? selectedGenres : undefined,
                socialLinks: Object.values(socialLinks).some(v => v.trim())
                    ? {
                        instagram: socialLinks.instagram.trim() || undefined,
                        youtube: socialLinks.youtube.trim() || undefined,
                        facebook: socialLinks.facebook.trim() || undefined,
                        tiktok: socialLinks.tiktok.trim() || undefined,
                    }
                    : undefined,
            };

            await createArtist(payload);
            alert("Đăng ký làm nghệ sĩ thành công! Vui lòng đăng nhập lại để cập nhật quyền.");
            dispatch(logOut());
            navigate("/");
        } catch (error: any) {
            console.error("Error creating artist:", error);
            const errorMessage = error?.response?.data?.errors?.[0] || error?.message || "Có lỗi xảy ra khi đăng ký";
            alert(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Become an Artist</h1>
                    <p className="text-neutral-400">
                        Create your artist profile to start uploading and sharing your music
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Stage Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">
                            Stage Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={stageName}
                            onChange={(e) => setStageName(e.target.value)}
                            placeholder="Enter your stage name"
                            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#1DB954]"
                            required
                        />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">
                            Bio
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#1DB954] resize-none"
                        />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">
                            Location
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City, Country"
                            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#1DB954]"
                        />
                    </div>

                    {/* Genre Focus */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-300">
                            Genre Focus
                        </label>
                        {selectedGenres.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 bg-[#1a1a1a] border border-neutral-700 rounded-lg mb-2">
                                {selectedGenres.map((genreId) => {
                                    const genre = genres.find((g) => g._id === genreId);
                                    return genre ? (
                                        <span
                                            key={genreId}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#1DB954] text-black rounded-full text-sm font-medium"
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
                        <p className="text-xs text-neutral-500">
                            Select genres that best describe your music
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-neutral-300">
                            Social Links (Optional)
                        </label>
                        <div className="space-y-3">
                            <input
                                type="url"
                                value={socialLinks.instagram}
                                onChange={(e) =>
                                    setSocialLinks({ ...socialLinks, instagram: e.target.value })
                                }
                                placeholder="Instagram URL"
                                className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#1DB954]"
                            />
                            <input
                                type="url"
                                value={socialLinks.youtube}
                                onChange={(e) =>
                                    setSocialLinks({ ...socialLinks, youtube: e.target.value })
                                }
                                placeholder="YouTube URL"
                                className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#1DB954]"
                            />
                            <input
                                type="url"
                                value={socialLinks.facebook}
                                onChange={(e) =>
                                    setSocialLinks({ ...socialLinks, facebook: e.target.value })
                                }
                                placeholder="Facebook URL"
                                className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#1DB954]"
                            />
                            <input
                                type="url"
                                value={socialLinks.tiktok}
                                onChange={(e) =>
                                    setSocialLinks({ ...socialLinks, tiktok: e.target.value })
                                }
                                placeholder="TikTok URL"
                                className="w-full bg-[#111] border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#1DB954]"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-black rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating..." : "Become an Artist"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BecomeArtistPage;

