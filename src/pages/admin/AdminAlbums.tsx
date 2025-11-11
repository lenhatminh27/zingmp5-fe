import React, { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import { notification, Spin, Table, Button, Space, Modal, Image } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface AdminAlbum {
  _id: string;
  title: string;
  image?: string;
  status?: string;
  songs?: string[];
  artist?: string[];
  key: string;
}

const AdminAlbums: React.FC = () => {
  const { getAlbums, isLoading } = useAdmin();
  const [albums, setAlbums] = useState<AdminAlbum[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedAlbum, setSelectedAlbum] = useState<AdminAlbum | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchAlbums = useCallback(async (page: number, limit: number) => {
    try {
      const response = await getAlbums(page, limit);
      const albumList = Array.isArray(response) ? response : (response as { data?: AdminAlbum[] })?.data || [];
      setAlbums(
        albumList.map((album: AdminAlbum, index: number) => ({
          ...album,
          key: album._id || String(index),
        }))
      );
      setPagination((prev) => ({
        ...prev,
        current: page,
        total: albumList.length,
      }));
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách album",
      });
    }
  }, [getAlbums]);

  useEffect(() => {
    fetchAlbums(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize, fetchAlbums]);

  const handleViewDetail = (album: AdminAlbum) => {
    setSelectedAlbum(album);
    setIsDetailModalOpen(true);
  };

  const columns: ColumnsType<AdminAlbum> = [
    {
      title: "Ảnh bìa",
      dataIndex: "image",
      key: "image",
      render: (image: string | undefined) =>
        image ? (
          <Image
            src={image}
            alt="Album cover"
            style={{ width: 50, height: 50, objectFit: "cover" }}
            preview={false}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">-</div>
        ),
      width: 80,
    },
    {
      title: "Tên album",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string | undefined) => status || "Công khai",
    },
    {
      title: "Số lượng bài hát",
      dataIndex: "songs",
      key: "songs",
      render: (songs: string[] | undefined) => (songs ? songs.length : 0),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Quản lý album</h2>
      </div>
      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={albums}
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
        title="Chi tiết Album"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedAlbum && (
          <div className="space-y-4">
            {selectedAlbum.image && (
              <div className="flex justify-center">
                <Image src={selectedAlbum.image} alt="Album cover" style={{ maxWidth: "200px" }} />
              </div>
            )}
            <div>
              <strong>Tên Album:</strong> {selectedAlbum.title}
            </div>
            <div>
              <strong>Trạng thái:</strong> {selectedAlbum.status || "Công khai"}
            </div>
            <div>
              <strong>Số lượng bài hát:</strong> {selectedAlbum.songs ? selectedAlbum.songs.length : 0}
            </div>
            {selectedAlbum.songs && selectedAlbum.songs.length > 0 && (
              <div>
                <strong>Danh sách bài hát:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  {selectedAlbum.songs.map((song: string, index: number) => {
                    const songTitle = typeof song === "string" ? song : (song as Record<string, string | number>).title || String(song);
                    return <li key={index}>{songTitle}</li>;
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminAlbums;
