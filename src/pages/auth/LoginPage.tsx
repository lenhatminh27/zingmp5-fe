import React from "react";
import {Button, Form, Input} from "antd";
import {useAuth} from "../../hooks/useAuth";
import {Link, useLocation, useNavigate} from "react-router-dom";

type LoginForm = { email: string; password: string };

const Login: React.FC = () => {
    const {login, isLoading} = useAuth();
    const [form] = Form.useForm<LoginForm>();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/";

    const onFinish = async (values: LoginForm) => {
        try {
            await login(values);
            navigate(from, {replace: true});
        } catch {
            // error đã được getErrorMessage handle trong hook
        }
    };

    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-[#121212] border border-[#262626] rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
                <p className="text-neutral-400 mb-6 text-sm">
                    Đăng nhập để tiếp tục nghe nhạc.
                </p>

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label={<span className="text-white">Email</span>}
                        name="email"
                        rules={[
                            {required: true, message: "Vui lòng nhập email"},
                            {type: "email", message: "Email không hợp lệ"},
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="you@example.com"
                            className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-white">Mật khẩu</span>}
                        name="password"
                        rules={[{required: true, message: "Vui lòng nhập mật khẩu"}]}
                    >
                        <Input.Password
                            size="large"
                            placeholder="••••••••"
                            className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                        />
                    </Form.Item>

                    <Button
                        htmlType="submit"
                        loading={isLoading}
                        size="large"
                        className="w-full !h-11 !font-semibold !text-black"
                        style={{
                            background:
                                "linear-gradient(90deg, #1DB954 0%, #3ea6c1 100%)",
                        }}
                    >
                        Đăng nhập
                    </Button>
                </Form>

                <div className="text-center mt-4 text-sm text-neutral-300">
                    Chưa có tài khoản?{" "}
                    <Link to="/register" className="text-[#1DB954] hover:underline">
                        Tạo tài khoản
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
