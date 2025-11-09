import React from "react";
import {Link} from "react-router-dom";

const NotFound: React.FC = () => (
    <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-2">404 — Không tìm thấy trang</h1>
        <Link to="/" className="px-4 py-2 rounded bg-white text-black">Về trang chủ</Link>
    </div>
);
export default NotFound;
