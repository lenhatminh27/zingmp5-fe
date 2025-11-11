import React, { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import { notification, Spin, Table, Button, Space, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface Role {
    _id?: string;
    name?: string;
}

interface AdminUser {
    _id: string;
    email: string;
    avatar?: string;
    active?: boolean;
    roles?: (Role | string)[];
    key: string;
}

const AdminUsers: React.FC = () => {
    const { getUsers, deleteUser, isLoading } = useAdmin();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchUsers = useCallback(async (page: number, limit: number) => {
        try {
            const response = await getUsers(page, limit);
            // Filter users without ADMIN role
            const filteredUsers = (Array.isArray(response) ? response : (response as { data?: AdminUser[] })?.data || []).filter(
                (user: AdminUser) => !user.roles?.some((r: Role | string) =>
                    (typeof r === "string" ? r : r.name) === "ADMIN"
                )
            );
            setUsers(
                filteredUsers.map((user: AdminUser, index: number) => ({
                    ...user,
                    key: user._id || String(index),
                }))
            );
            setPagination((prev) => ({
                ...prev,
                current: page,
                total: filteredUsers.length,
            }));
        } catch (err) {
            console.error(err);
            notification.error({
                message: "Lỗi",
                description: "Không thể tải danh sách người dùng",
            });
        }
    }, [getUsers]);

    useEffect(() => {
        fetchUsers(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize, fetchUsers]);

    const handleDelete = (userId: string) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa người dùng này?",
            okText: "Xóa",
            cancelText: "Hủy",
            okType: "danger",
            async onOk() {
                setDeletingId(userId);
                try {
                    await deleteUser(userId);
                    notification.success({
                        message: "Thành công",
                        description: "Người dùng đã được xóa",
                    });
                    fetchUsers(pagination.current, pagination.pageSize);
                } catch (err) {
                    console.error(err);
                    notification.error({
                        message: "Lỗi",
                        description: "Không thể xóa người dùng",
                    });
                } finally {
                    setDeletingId(null);
                }
            },
        });
    };

    const columns: ColumnsType<AdminUser> = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: "Vai trò",
            dataIndex: "roles",
            key: "roles",
            render: (roles: (Role | string)[]) => {
                const roleNames = (roles || []).map((r: Role | string) => (typeof r === "string" ? r : r.name)).join(", ");
                return roleNames || "User";
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            key: "active",
            render: (active: boolean) => (active ? "Hoạt động" : "Vô hiệu hóa"),
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        loading={deletingId === record._id}
                        onClick={() => handleDelete(record._id)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>
            </div>
            <Spin spinning={isLoading}>
                <Table
                    columns={columns}
                    dataSource={users}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        onChange: (page, pageSize) => {
                            setPagination({ current: page, pageSize, total: pagination.total });
                        },
                    }}
                    bordered
                    className="bg-[#1a1a1a] border-[#262626]"
                    rowClassName="bg-[#0f0f0f] text-white"
                />
            </Spin>
        </div>
    );
};

export default AdminUsers;
