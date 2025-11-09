import React from "react";
import {Link, NavLink, Outlet} from "react-router-dom";

const AdminLayout: React.FC = () => {
    return (
        <div className="min-h-screen grid grid-cols-[240px_1fr] bg-[#0f0f0f] text-white">
            <aside className="border-r border-[#262626] p-4">
                <Link to="/admin" className="block font-bold mb-6">
                    <span style={{color: "#1DB954"}}>Sac</span>Viet
                    <span style={{color: "#3ea6c1"}}>Admin</span>
                </Link>
                <nav className="space-y-2 text-sm">
                    <NavLink to="/admin" end
                             className={({isActive}) => isActive ? "text-white" : "text-gray-300 hover:text-white"}>Dashboard</NavLink>
                    <NavLink to="/admin/songs"
                             className={({isActive}) => isActive ? "text-white" : "text-gray-300 hover:text-white"}>Songs</NavLink>
                    <NavLink to="/admin/albums"
                             className={({isActive}) => isActive ? "text-white" : "text-gray-300 hover:text-white"}>Albums</NavLink>
                    <NavLink to="/admin/artists"
                             className={({isActive}) => isActive ? "text-white" : "text-gray-300 hover:text-white"}>Artists</NavLink>
                    <NavLink to="/admin/genres"
                             className={({isActive}) => isActive ? "text-white" : "text-gray-300 hover:text-white"}>Genres</NavLink>
                    <NavLink to="/admin/accounts"
                             className={({isActive}) => isActive ? "text-white" : "text-gray-300 hover:text-white"}>Accounts</NavLink>
                </nav>
            </aside>

            <section>
                <header className="h-14 border-b border-[#262626] flex items-center px-6">
                    <div className="text-sm text-gray-300">Admin Panel</div>
                </header>
                <main className="p-6">
                    <Outlet/>
                </main>
            </section>
        </div>
    );
};

export default AdminLayout;
