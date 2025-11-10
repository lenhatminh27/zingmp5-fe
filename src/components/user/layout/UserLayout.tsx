import React, {useEffect, useRef, useState} from "react";
import {Link, NavLink, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import {getEmail, getName, getRole, isUserAuthenticated} from "../../../store/reducers/auth.ts";
import {useAuth} from "../../../hooks/useAuth.ts";
import {ROLES} from "../../../constants/role.ts";
import MusicPlayer from "../song/MusicPlayer.tsx";

const UserMenu: React.FC = () => {
    const email = useSelector(getEmail);
    const name = useSelector(getName);
    const roles = useSelector(getRole);
    const {logout} = useAuth();

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const displayName = name?.trim() || email || "User";
    const initial = (displayName?.[0] || "U").toUpperCase();

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("click", onClickOutside);
        return () => document.removeEventListener("click", onClickOutside);
    }, []);

    const isAdmin = roles?.includes(ROLES.ADMIN);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2"
                aria-haspopup="menu"
                aria-expanded={open}
            >
        <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] border border-[#262626] text-sm font-semibold">
          {initial}
        </span>
                <span className="hidden sm:block text-sm text-neutral-200 max-w-[160px] truncate">
          {displayName}
        </span>
                <span className="text-neutral-400">▾</span>
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 mt-2 w-64 rounded-xl border border-[#262626] bg-[#111]/95 backdrop-blur shadow-lg p-2 z-30"
                >
                    <div className="px-3 py-2">
                        <div className="text-sm font-semibold">{displayName}</div>
                        <div className="text-xs text-neutral-400 truncate">{email}</div>

                    </div>

                    <div className="my-2 h-px bg-[#1f1f1f]"/>

                    <div className="flex flex-col">
                        <Link
                            to="/profile"
                            className="px-3 py-2 text-sm rounded-lg hover:bg-[#1a1a1a] text-neutral-200"
                            onClick={() => setOpen(false)}
                        >
                            Profile
                        </Link>
                        <Link
                            to="/upload"
                            className="px-3 py-2 text-sm rounded-lg hover:bg-[#1a1a1a] text-neutral-200"
                            onClick={() => setOpen(false)}
                        >
                            Upload
                        </Link>
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="px-3 py-2 text-sm rounded-lg hover:bg-[#1a1a1a] text-neutral-200"
                                onClick={() => setOpen(false)}
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    <div className="my-2 h-px bg-[#1f1f1f]"/>

                    <button
                        onClick={() => {
                            setOpen(false);
                            logout();
                        }}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[#1a1a1a] text-red-400"
                    >
                        Đăng xuất
                    </button>
                </div>
            )}
        </div>
    );
};

const UserLayout: React.FC = () => {
    const authed = useSelector(isUserAuthenticated);

    const navItemClass = (isActive: boolean) =>
        `h-11 inline-flex items-center px-1.5 transition-colors ${
            isActive
                ? "text-white border-b-2 border-[#1DB954]"
                : "text-neutral-400 hover:text-white"
        }`;

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white">
            {/* Top bar */}
            <header className="sticky top-0 z-20 bg-[#0f0f0f]/80 backdrop-blur border-b border-[#262626]">
                <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-4">
                    {/* Logo */}
                    <Link to="/" className="font-extrabold tracking-tight whitespace-nowrap">
                        <span className="text-[#1DB954]">Viet</span>
                        <span className="text-[#3ea6c1]">Sound</span>
                    </Link>

                    {/* Search (center) */}
                    <div className="hidden md:flex flex-1">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search for tracks, artists, albums"
                                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-full pl-10 pr-4 py-2 text-sm placeholder:text-neutral-400 outline-none focus:border-[#1DB954]"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                🔎
              </span>
                        </div>
                    </div>

                    {/* Actions (right) */}
                    <div className="ml-auto flex items-center gap-3">
                        {authed ? (
                            <>
                                <Link
                                    to="/upload"
                                    className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-white text-black text-sm font-semibold hover:opacity-90"
                                >
                                    Upload
                                </Link>
                                <UserMenu/>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm text-neutral-300 hover:text-white">
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-3 py-1.5 rounded-full text-sm font-semibold"
                                    style={{
                                        background: "linear-gradient(90deg,#1DB954,#3ea6c1)",
                                        color: "#0b0b0b",
                                    }}
                                >
                                    Create account
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Secondary nav */}
                <nav className="border-t border-[#161616]">
                    <div className="mx-auto max-w-6xl px-4 flex items-center gap-6">
                        <NavLink to="/" end className={({isActive}) => navItemClass(isActive)}>
                            Home
                        </NavLink>
                        {authed && (
                            <NavLink to="/library" className={({isActive}) => navItemClass(isActive)}>
                                Library
                            </NavLink>
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero khi chưa đăng nhập */}
            {!authed && (
                <section className="border-b border-[#161616]">
                    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
                        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                            What’s next in music is first on{" "}
                            <span className="text-[#1DB954]">SacViet</span>
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

            {/* Page content */}
            <main className="mx-auto max-w-6xl px-4 py-6 pb-28">
                <Outlet/>
                <MusicPlayer/>
            </main>

            <footer className="h-0"/>
        </div>
    );
};

export default UserLayout;
