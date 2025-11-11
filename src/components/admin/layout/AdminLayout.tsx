import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../../hooks/useAuth";

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="min-h-screen grid grid-cols-[240px_1fr] bg-[#0f0f0f] text-white">
            <aside className="border-r border-[#262626] p-4">
                <Link to="/admin" className="block font-bold mb-6">
                    <span style={{ color: "#1DB954" }}>Sac</span>Viet
                    <span style={{ color: "#3ea6c1" }}>Admin</span>
                </Link>
                <nav className="space-y-2 text-sm">
                    <NavLink to="/admin" end
                        className={({ isActive }) => isActive ? "block px-3 py-2 rounded bg-[#1DB954] text-black font-medium" : "block px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-[#1a1a1a]"}>Dashboard</NavLink>
                    <NavLink to="/admin/accounts"
                        className={({ isActive }) => isActive ? "block px-3 py-2 rounded bg-[#1DB954] text-black font-medium" : "block px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-[#1a1a1a]"}>Người dùng</NavLink>
                    <NavLink to="/admin/albums"
                        className={({ isActive }) => isActive ? "block px-3 py-2 rounded bg-[#1DB954] text-black font-medium" : "block px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-[#1a1a1a]"}>Album</NavLink>
                    <NavLink to="/admin/songs"
                        className={({ isActive }) => isActive ? "block px-3 py-2 rounded bg-[#1DB954] text-black font-medium" : "block px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-[#1a1a1a]"}>Bài hát</NavLink>
                    <NavLink to="/admin/genres"
                        className={({ isActive }) => isActive ? "block px-3 py-2 rounded bg-[#1DB954] text-black font-medium" : "block px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-[#1a1a1a]"}>Thể loại</NavLink>
                </nav>
            </aside>

            <section>
                <header className="h-14 border-b border-[#262626] flex items-center justify-between px-6">
                    <div className="text-sm text-gray-300">Admin Panel</div>
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Đăng xuất
                    </Button>
                </header>
                <main className="p-6">
                    <Outlet />
                </main>
            </section>
        </div>
    );
};

export default AdminLayout;
