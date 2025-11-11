import React, { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import { notification, Spin, Table, Button, Space, Modal, Image, Tag } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { formatDuration } from "../../utils/helpers";

interface Genre {
  _id?: string;
  name?: string;
}

interface Artist {
  _id?: string;
  stageName?: string;
}

interface AdminSong {
  _id: string;
  title: string;
  image?: string;
  duration: number;
  views?: number;
  likes?: number;
  artists?: (Artist | string)[];
  genres?: (Genre | string)[];
  key: string;
}

const AdminSongs: React.FC = () => {
  const { getSongs, deleteSong, isLoading } = useAdmin();
  const [songs, setSongs] = useState<AdminSong[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedSong, setSelectedSong] = useState<AdminSong | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSongs = useCallback(async (page: number, limit: number) => {
    try {
      const response = await getSongs(page, limit);
      const songList = Array.isArray(response) ? response : (response as { data?: AdminSong[] })?.data || [];
      setSongs(
        songList.map((song: AdminSong, index: number) => ({
          ...song,
          key: song._id || String(index),
        }))
      );
      setPagination((prev) => ({
        ...prev,
        current: page,
        total: songList.length,
      }));
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách bài hát",
      });
    }
  }, [getSongs]);

  useEffect(() => {
    fetchSongs(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize, fetchSongs]);

  const handleViewDetail = (song: AdminSong) => {
    setSelectedSong(song);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (songId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa bài hát này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      async onOk() {
        setDeletingId(songId);
        try {
          await deleteSong(songId);
          notification.success({
            message: "Thành công",
            description: "Bài hát đã được xóa",
          });
          fetchSongs(pagination.current, pagination.pageSize);
        } catch (err) {
          console.error(err);
          notification.error({
            message: "Lỗi",
            description: "Không thể xóa bài hát",
          });
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const columns: ColumnsType<AdminSong> = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string | undefined) =>
        image ? (
          <Image
            src={image}
            alt="Song cover"
            style={{ width: 50, height: 50, objectFit: "cover" }}
            preview={false}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">-</div>
        ),
      width: 80,
    },
    {
      title: "Tên bài hát",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => formatDuration(duration),
      width: 100,
    },
    {
      title: "Lượt nghe",
      dataIndex: "views",
      key: "views",
      sorter: (a, b) => (a.views || 0) - (b.views || 0),
      width: 100,
    },
    {
      title: "Likes",
      dataIndex: "likes",
      key: "likes",
      sorter: (a, b) => (a.likes || 0) - (b.likes || 0),
      width: 80,
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
        <h2 className="text-2xl font-bold mb-4">Quản lý bài hát</h2>
      </div>
      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={songs}
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
        title="Chi tiết Bài hát"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedSong && (
          <div className="space-y-4">
            {selectedSong.image && (
              <div className="flex justify-center">
                <Image src={selectedSong.image} alt="Song cover" style={{ maxWidth: "200px" }} />
              </div>
            )}
            <div>
              <strong>Tên bài hát:</strong> {selectedSong.title}
            </div>
            <div>
              <strong>Thời lượng:</strong> {formatDuration(selectedSong.duration)}
            </div>
            <div>
              <strong>Lượt nghe:</strong> {selectedSong.views || 0}
            </div>
            <div>
              <strong>Likes:</strong> {selectedSong.likes || 0}
            </div>
            {selectedSong.artists && selectedSong.artists.length > 0 && (
              <div>
                <strong>Nghệ sĩ:</strong>
                <div className="mt-2 space-x-1">
                  {(selectedSong.artists as (Artist | string)[]).map((artist: Artist | string, index: number) => {
                    const artistName = typeof artist === "string" ? artist : artist.stageName || String(artist);
                    return <Tag key={index}>{artistName}</Tag>;
                  })}
                </div>
              </div>
            )}
            {selectedSong.genres && selectedSong.genres.length > 0 && (
              <div>
                <strong>Thể loại:</strong>
                <div className="mt-2 space-x-1">
                  {(selectedSong.genres as (Genre | string)[]).map((genre: Genre | string, index: number) => {
                    const genreName = typeof genre === "string" ? genre : genre.name || String(genre);
                    return (
                      <Tag key={index} color="blue">
                        {genreName}
                      </Tag>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminSongs;
