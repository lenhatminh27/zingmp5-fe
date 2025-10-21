import {useSelector} from "react-redux";
import {isUserAuthenticated} from "../store/reducers/auth.ts";
import {Navigate, Outlet} from "react-router-dom";
import {Suspense} from "react";

const AuthRoute = () => {
    const isAuthenticated = useSelector(isUserAuthenticated);
    return isAuthenticated ? (
        <Navigate to={"/"}/>
    ) : (
        <Suspense fallback={<div>Loading...</div>}><Outlet/></Suspense>
    );
};

export default AuthRoute;
