import React, {Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import RequireRole from "./RequireRole.tsx";
import AdminLayout from "../components/admin/layout/AdminLayout.tsx";
import RequireAuth from "./RequireAuth.tsx";
import {ROLES} from "../constants/role.ts";

import Home from "../pages/user/Home.tsx";
import Library from "../pages/user/Library.tsx";
import Dashboard from "../pages/admin/Dashboard";
import Forbidden from "../pages/Forbidden";
import NotFound from "../pages/NotFound";
import UserLayout from "../components/user/layout/UserLayout.tsx";

const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<div className="text-white/70 p-6">Loading…</div>}>
            <Routes>
                {/* USER LAYOUT */}
                <Route element={<UserLayout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="library" element={<Library/>}/>

                    {/* Các trang cần đăng nhập người dùng */}
                    <Route element={<RequireAuth/>}>
                        {/* ví dụ: playlist cá nhân, favorites... */}
                    </Route>
                </Route>

                {/* ADMIN LAYOUT */}
                <Route element={<RequireAuth/>}>
                    <Route element={<RequireRole allow={[ROLES.ADMIN]}/>}>
                        <Route path="/admin" element={<AdminLayout/>}>
                            <Route index element={<Dashboard/>}/>
                            <Route path="songs" element={<div className="text-white">Manage Songs</div>}/>
                            <Route path="albums" element={<div className="text-white">Manage Albums</div>}/>
                            <Route path="artists" element={<div className="text-white">Manage Artists</div>}/>
                            <Route path="genres" element={<div className="text-white">Manage Genres</div>}/>
                            <Route path="accounts" element={<div className="text-white">Manage Accounts</div>}/>
                        </Route>
                    </Route>
                </Route>

                <Route path="/forbidden" element={<Forbidden/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
