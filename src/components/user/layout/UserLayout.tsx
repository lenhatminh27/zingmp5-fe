// src/layouts/UserLayout.tsx
import React from "react";
import {Link, NavLink, Outlet} from "react-router-dom";

const UserLayout: React.FC = () => {
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
                        <span className="text-[#1DB954]">Sac</span>
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
                        <Link
                            to="/upload"
                            className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-white text-black text-sm font-semibold hover:opacity-90"
                        >
                            Upload
                        </Link>
                        <Link to="/login" className="text-sm text-neutral-300 hover:text-white">
                            Sign in
                        </Link>
                        <Link
                            to="/register"
                            className="px-3 py-1.5 rounded-full text-sm font-semibold"
                            style={{background: "linear-gradient(90deg,#1DB954,#3ea6c1)", color: "#0b0b0b"}}
                        >
                            Create account
                        </Link>
                    </div>
                </div>

                {/* Secondary nav (tabs) */}
                <nav className="border-t border-[#161616]">
                    <div className="mx-auto max-w-6xl px-4 flex items-center gap-6">
                        <NavLink to="/" end className={({isActive}) => navItemClass(isActive)}>
                            Stream
                        </NavLink>
                        <NavLink to="/library" className={({isActive}) => navItemClass(isActive)}>
                            Library
                        </NavLink>
                        {/* Bạn có thể thêm Discover/Charts sau này */}
                    </div>
                </nav>
            </header>

            {/* Page content */}
            <main className="mx-auto max-w-6xl px-4 py-6 pb-28">
                <Outlet/>
            </main>

            {/* reserved space cho Global Player dính đáy */}
            <footer className="h-0"/>
        </div>
    );
};

export default UserLayout;
