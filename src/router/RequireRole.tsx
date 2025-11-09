import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import {ROLES} from "../constants/role.ts";

type Props = {
    allow: Array<keyof typeof ROLES | string>;
};

const selectRoles = (s: any) => (s.auth?.roles as string[]) ?? [];

const RequireRole: React.FC<Props> = ({allow}) => {
    const roles = useSelector(selectRoles);
    const can = roles?.some((r) => allow.includes(r));
    if (!can) return <Navigate to="/forbidden" replace/>;
    return <Outlet/>;
};

export default RequireRole;
