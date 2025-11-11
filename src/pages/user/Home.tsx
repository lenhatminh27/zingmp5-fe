import React, {useEffect, useMemo, useState} from "react";
import type {AxiosError} from "axios";
import {getArtistNames, getErrorMessage} from "../../utils/helpers";
import type {IAlbum, IGenre, ISong} from "../../types/model.type"; // Import thêm IGenre
import {useSongs} from "../../hooks/useSongs";
import {useGenres} from "../../hooks/useGenres"; // 1. Import useGenres
import TrackCard from "../../components/user/song/TrackCard.tsx";
import TrackCardSkeleton from "../../components/user/song/TrackCardSkeleton.tsx";
import {useDispatch, useSelector} from "react-redux";
import {startPlaying} from "../../store/reducers/player.ts";
import ArtistSidebar from "../../components/user/artist/ArtistSidebar.tsx";
import {Link} from "react-router-dom";
import {isUserAuthenticated} from "../../store/reducers/auth.ts";
import {useAlbums} from "../../hooks/useAlbums.ts";
import AlbumCardSkeleton from "../../components/user/album/AlbumCardSkeleton.tsx";
import AlbumCard from "../../components/user/album/AlbumCard.tsx";

const PAGE_SIZE = 12;

const Tag: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({label, isActive, onClick}) => (
    <button
        onClick={onClick}
        className={`inline-flex items-center rounded-full border bg-[#161616] px-3 py-1 text-xs transition-colors
      ${isActive
            ? "border-[#1DB954] text-white"
            : "border-[#262626] text-neutral-300 hover:border-neutral-500"
        }`}
    >
        {label}
    </button>
);

const Home: React.FC = () => {
    const dispatch = useDispatch();
    const {list: getSongs, isLoading: isSongsLoading} = useSongs();
    const {getGenres, isLoading: isGenresLoading} = useGenres();
    const {getAlbums, isLoading: isAlbumsLoading} = useAlbums();
    const authed = useSelector(isUserAuthenticated);

    const [songs, setSongs] = useState<ISong[]>([]);
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [albums, setAlbums] = useState<IAlbum[]>([])
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [q, setQ] = useState("");
    const [visible, setVisible] = useState(PAGE_SIZE);

    useEffect(() => {
        (async () => {
            try {
                const genresData = await getGenres();
                setGenres(Array.isArray(genresData) ? genresData : []);
            } catch (e) {
                getErrorMessage(e as AxiosError);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const songsData = await getSongs();
                setSongs(Array.isArray(songsData) ? songsData : []);
            } catch (e) {
                getErrorMessage(e as AxiosError);
            }
        })();
    }, [getSongs]);

    useEffect(() => {
        (async () => {
            try {
                const albumsData = await getAlbums();
                setAlbums(Array.isArray(albumsData) ? albumsData : []);
            } catch (e) {
                getErrorMessage(e as AxiosError);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        const kw = q.trim().toLowerCase();

        return songs.filter((s) => {
            if (selectedGenre) {
                const hasGenre = s.genres.some(genre =>
                    (typeof genre === 'object' ? genre._id : genre) === selectedGenre
                );
                if (!hasGenre) {
                    return false;
                }
            }

            if (kw) {
                const title = (s.title || "").toLowerCase();
                const artists = getArtistNames(s.artists)?.toLowerCase();
                return title.includes(kw) || artists.includes(kw);
            }

            return true;
        });
    }, [q, songs, selectedGenre]);

    const toShow = filtered.slice(0, visible);
    const canLoadMore = visible < filtered.length;

    const handleGenreClick = (genreId: string | null) => {
        setSelectedGenre(genreId);
        setVisible(PAGE_SIZE);
    };

    const handlePlay = (songToPlay: ISong) => {
        const index = toShow.findIndex(s => s._id === songToPlay._id);
        if (index !== -1) {
            dispatch(startPlaying({songs: toShow, index}));
        }
    };

    const isLoading = isSongsLoading || isGenresLoading;

    return (
        <div className="space-y-8">
            {!authed && (
                <section className="border-b w-full border-[#161616]">
                    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
                        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                            What’s next in music is first on{" "}
                            <span className="text-[#1DB954]">Viet</span>
                            <span className="text-[#3ea6c1]">Sound</span>
                        </h1>
                        <p className="text-neutral-300 mt-2">
                            Join to stream tracks, follow artists you love, and upload your first song.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                to="/register"
                                className="px-5 py-2.5 rounded-full font-semibold text-black"
                                style={{background: "linear-gradient(90deg,#1DB954,#3ea6c1)"}}
                            >
                                Create account
                            </Link>
                            <Link
                                to="/login"
                                className="px-5 py-2.5 rounded-full border border-[#2a2a2a] text-white hover:bg-[#1a1a1a]"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </section>
            )}
            <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-0">
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Stream</h2>
                                <p className="mt-1 text-sm text-neutral-400">Hear the latest tracks from artists you
                                    follow
                                    and
                                    what’s trending now.</p>
                            </div>

                            {/* Local search */}
                            <div className="w-full md:w-72">
                                <div className="relative">
                                    <input
                                        value={q}
                                        onChange={(e) => {
                                            setQ(e.target.value);
                                            setVisible(PAGE_SIZE);
                                        }}
                                        placeholder="Search tracks or artists"
                                        className="w-full bg-[#1a1a1a] border border-[#262626] rounded-full pl-10 pr-4 py-2 text-sm placeholder:text-neutral-400 outline-none focus:border-[#1DB954]"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">🔎</span>
                                </div>
                            </div>
                        </div>

                        {/* 4. Render các tag genre động */}
                        <div className="flex flex-wrap gap-2">
                            <Tag
                                label="All"
                                isActive={selectedGenre === null}
                                onClick={() => handleGenreClick(null)}
                            />
                            {genres.map((genre) => (
                                <Tag
                                    key={genre._id}
                                    label={genre.name}
                                    isActive={selectedGenre === genre._id}
                                    onClick={() => handleGenreClick(genre._id)}
                                />
                            ))}
                        </div>

                        {/* Track Grid */}
                        <div
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {isLoading && (
                                Array.from({length: 12}).map((_, i) => <TrackCardSkeleton key={i}/>)
                            )}

                            {!isLoading && toShow.length === 0 && (
                                <div
                                    className="col-span-full rounded-xl border border-[#262626] bg-[#111]/60 p-8 text-center text-neutral-300">
                                    Không có bài hát nào phù hợp.
                                </div>
                            )}

                            {!isLoading &&
                                toShow.map((song) => (
                                    <TrackCard key={song._id} song={song} onPlay={() => handlePlay(song)}/>
                                ))}
                        </div>

                        {/* Load more */}
                        {!isLoading && canLoadMore && (
                            <div className="flex justify-center pt-2">
                                <button
                                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                                    className="px-5 py-2.5 rounded-full font-semibold text-black hover:opacity-95"
                                    style={{background: "linear-gradient(90deg,#1DB954,#3ea6c1)"}}
                                >
                                    Load more
                                </button>
                            </div>
                        )}
                    </div>
                    <section className={'mt-10'}>
                        <h2 className="text-2xl font-bold tracking-tight mb-4">New Albums</h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 -mx-1 px-1">
                            {isAlbumsLoading && (
                                Array.from({length: 6}).map((_, i) => (
                                    <div key={i} className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 flex-shrink-0">
                                        <AlbumCardSkeleton/>
                                    </div>
                                ))
                            )}
                            {!isAlbumsLoading && albums.map((album) => (
                                <div key={album._id} className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 flex-shrink-0">
                                    <AlbumCard album={album}/>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                <ArtistSidebar/>
            </div>
        </div>
    );
};

export default Home;