import React, {Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import RequireRole from "./RequireRole.tsx";
import AdminLayout from "../components/admin/layout/AdminLayout.tsx";
import RequireAuth from "./RequireAuth.tsx";
import {ROLES} from "../constants/role.ts";

import Home from "../pages/user/Home.tsx";
import Library from "../pages/user/Library.tsx";
import UploadSongPage from "../pages/user/UploadSongPage.tsx";
import UploadAlbumPage from "../pages/user/UploadAlbumPage.tsx";
import EditSongPage from "../pages/user/EditSongPage.tsx";
import EditAlbumPage from "../pages/user/EditAlbumPage.tsx";
import MyUploadsPage from "../pages/user/MyUploadsPage.tsx";
import BecomeArtistPage from "../pages/user/BecomeArtistPage.tsx";
import Dashboard from "../pages/admin/Dashboard";
import Forbidden from "../pages/Forbidden";
import NotFound from "../pages/NotFound";
import UserLayout from "../components/user/layout/UserLayout.tsx";
import Login from "../pages/auth/LoginPage.tsx";
import Register from "../pages/auth/Register.tsx";
import ProfilePage from "../pages/user/ProfilePage.tsx";

const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<div className="text-white/70 p-6">Loading…</div>}>
            <Routes>
                <Route element={<UserLayout/>}>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route index element={<Home/>}/>
                    <Route path="library" element={<Library/>}/>

                    <Route element={<RequireAuth/>}>
                        <Route path="become-artist" element={<BecomeArtistPage/>}/>
                        <Route path="profile" element={<ProfilePage/>}/>
                        <Route element={<RequireRole allow={[ROLES.ARTIST]}/>}>
                            <Route path="upload" element={<UploadSongPage/>}/>
                            <Route path="upload/:id" element={<EditSongPage/>}/>
                            <Route path="upload-album" element={<UploadAlbumPage/>}/>
                            <Route path="upload-album/:id" element={<EditAlbumPage/>}/>
                            <Route path="my-uploads" element={<MyUploadsPage/>}/>
                        </Route>
                    </Route>
                </Route>

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
