import {useSelector} from "react-redux";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {getRole, isUserAuthenticated} from "../store/reducers/auth.ts";
import {Suspense} from "react";

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute = ({allowedRoles}: ProtectedRouteProps) => {
    const location = useLocation();
    const isAuthenticated = useSelector(isUserAuthenticated);
    const roles = useSelector(getRole)
    const isAuthorized = roles?.some(role => allowedRoles.includes(role));

    if (!isAuthenticated || !isAuthorized) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    return <Suspense fallback={<div>Loading...</div>}><Outlet/></Suspense>;
};

export default ProtectedRoute;