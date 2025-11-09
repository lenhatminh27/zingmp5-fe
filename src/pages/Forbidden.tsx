import React from "react";
import {Link} from "react-router-dom";

const Forbidden: React.FC = () => (
    <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-2">403 — Bạn không có quyền truy cập</h1>
        <p className="text-gray-400 mb-6">Vui lòng đăng nhập bằng tài khoản có quyền phù hợp.</p>
        <Link to="/" className="px-4 py-2 rounded bg-white text-black">Về trang chủ</Link>
    </div>
);
export default Forbidden;
