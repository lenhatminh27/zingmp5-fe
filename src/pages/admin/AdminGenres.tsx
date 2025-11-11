import React, { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import { notification, Spin, Table, Button, Space, Modal, Form, Input } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface AdminGenre {
  _id: string;
  name: string;
  description?: string;
  key: string;
}

const AdminGenres: React.FC = () => {
  const { getGenres, createGenre, updateGenre, deleteGenre, isLoading } = useAdmin();
  const [genres, setGenres] = useState<AdminGenre[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<AdminGenre | null>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchGenres = useCallback(async (page: number, limit: number) => {
    try {
      const response = await getGenres(page, limit);
      const genreList = Array.isArray(response) ? response : (response as { data?: AdminGenre[] })?.data || [];
      setGenres(
        genreList.map((genre: AdminGenre, index: number) => ({
          ...genre,
          key: genre._id || String(index),
        }))
      );
      setPagination((prev) => ({
        ...prev,
        current: page,
        total: genreList.length,
      }));
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách thể loại",
      });
    }
  }, [getGenres]);

  useEffect(() => {
    fetchGenres(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize, fetchGenres]);

  const handleOpenModal = (genre?: AdminGenre) => {
    if (genre) {
      setEditingGenre(genre);
      form.setFieldsValue({
        name: genre.name,
        description: genre.description,
      });
    } else {
      setEditingGenre(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: { name: string; description?: string }) => {
    setSubmitting(true);
    try {
      if (editingGenre) {
        await updateGenre(editingGenre._id, values);
        notification.success({
          message: "Thành công",
          description: "Thể loại đã được cập nhật",
        });
      } else {
        await createGenre(values);
        notification.success({
          message: "Thành công",
          description: "Thể loại đã được tạo",
        });
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchGenres(pagination.current, pagination.pageSize);
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Lỗi",
        description: editingGenre ? "Không thể cập nhật thể loại" : "Không thể tạo thể loại",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (genreId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thể loại này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      async onOk() {
        try {
          await deleteGenre(genreId);
          notification.success({
            message: "Thành công",
            description: "Thể loại đã được xóa",
          });
          fetchGenres(pagination.current, pagination.pageSize);
        } catch (err) {
          console.error(err);
          notification.error({
            message: "Lỗi",
            description: "Không thể xóa thể loại",
          });
        }
      },
    });
  };

  const columns: ColumnsType<AdminGenre> = [
    {
      title: "Tên thể loại",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (description: string | undefined) => description || "-",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý thể loại</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          Thêm thể loại
        </Button>
      </div>
      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={genres}
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

      <Modal
        title={editingGenre ? "Sửa thể loại" : "Thêm thể loại"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            onClick={() => form.submit()}
          >
            {editingGenre ? "Cập nhật" : "Tạo"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên thể loại"
            rules={[
              { required: true, message: "Vui lòng nhập tên thể loại" },
              { min: 2, message: "Tên thể loại phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input placeholder="Nhập tên thể loại" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { max: 500, message: "Mô tả không được quá 500 ký tự" },
            ]}
          >
            <Input.TextArea
              placeholder="Nhập mô tả"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminGenres;
