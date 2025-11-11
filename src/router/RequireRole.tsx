import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import {ROLES} from "../constants/role.ts";
import {getRole} from "../store/reducers/auth.ts";

type Props = {
    allow: Array<keyof typeof ROLES | string>;
};

const RequireRole: React.FC<Props> = ({allow}) => {
    const roles = useSelector(getRole);
    const can = roles?.some((r) => allow.includes(r));
    console.log(roles)
    if (!can) return <Navigate to="/forbidden" replace/>;
    return <Outlet/>;
};

export default RequireRole;
