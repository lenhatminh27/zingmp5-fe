import React from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

const selectAccessToken = (s: any) => s.auth?.accessToken;

const RequireAuth: React.FC = () => {
    const token = useSelector(selectAccessToken);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace state={{from: location}}/>;
    }
    return <Outlet/>;
};

export default RequireAuth;
