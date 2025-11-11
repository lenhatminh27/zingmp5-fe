import { useSelector } from "react-redux";
import { getRole } from "../store/reducers/auth.ts";
import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "../constants/role.ts";
import { Suspense } from "react";

const PublicRoute = () => {
    const roles = useSelector(getRole);
    let children = <Suspense fallback={<div>Loading...</div>}><Outlet /></Suspense>;
    if (roles.includes(ROLES.ADMIN)) {
        children = <Navigate to={"/admin"} />;
    }
    return children
};

export default PublicRoute;
