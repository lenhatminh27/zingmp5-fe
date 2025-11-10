import React from "react";
import {Button, Form, Input, message} from "antd";
import {useAuth} from "../../hooks/useAuth";
import {Link, useNavigate} from "react-router-dom";

type RegisterForm = { email: string; password: string; confirm: string };

const Register: React.FC = () => {
    const {signUp, isLoading} = useAuth();
    const [form] = Form.useForm<RegisterForm>();
    const navigate = useNavigate();

    const onFinish = async (values: RegisterForm) => {
        try {
            await signUp({email: values.email, password: values.password});
            message.success("Tạo tài khoản thành công! Vui lòng đăng nhập.");
            navigate("/login", {replace: true});
        } catch {
            // error đã được getErrorMessage handle trong hook
        }
    };

    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-[#121212] border border-[#262626] rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-1">Create your account</h1>
                <p className="text-neutral-400 mb-6 text-sm">
                    Tham gia SacSound để khám phá âm nhạc.
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
                        rules={[
                            {required: true, message: "Vui lòng nhập mật khẩu"},
                            {min: 6, message: "Mật khẩu tối thiểu 6 ký tự"},
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            size="large"
                            placeholder="••••••••"
                            className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-white">Xác nhận mật khẩu</span>}
                        name="confirm"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            {required: true, message: "Vui lòng xác nhận mật khẩu"},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("Mật khẩu xác nhận không khớp")
                                    );
                                },
                            }),
                        ]}
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
                        Tạo tài khoản
                    </Button>
                </Form>

                <div className="text-center mt-4 text-sm text-neutral-300">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-[#1DB954] hover:underline">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
