import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Card, Statistic, Spin } from "antd";
import { UserOutlined, BgColorsOutlined } from "@ant-design/icons";
import { useAdmin } from "../../hooks/useAdmin";

interface IStats {
    usersCount: number;
    songsCount: number;
    albumsCount: number;
    genresCount: number;
}

const Dashboard: React.FC = () => {
    const { getUsers, getSongs, getAlbums, getGenres, isLoading } = useAdmin();
    const [stats, setStats] = useState<IStats>({
        usersCount: 0,
        songsCount: 0,
        albumsCount: 0,
        genresCount: 0,
    });

    const loadStats = useCallback(async () => {
        try {
            const [users, songs, albums, genres] = await Promise.all([
                getUsers(1, 1000),
                getSongs(1, 1000),
                getAlbums(1, 1000),
                getGenres(1, 1000),
            ]);

            setStats({
                usersCount: Array.isArray(users) ? users.length : (users as IStats)?.usersCount || 0,
                songsCount: Array.isArray(songs) ? songs.length : (songs as IStats)?.songsCount || 0,
                albumsCount: Array.isArray(albums) ? albums.length : (albums as IStats)?.albumsCount || 0,
                genresCount: Array.isArray(genres) ? genres.length : (genres as IStats)?.genresCount || 0,
            });
        } catch (err) {
            console.error("Failed to load stats:", err);
        }
    }, [getUsers, getSongs, getAlbums, getGenres]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Bảng điều khiển</h1>
            <Spin spinning={isLoading}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Người dùng"
                                value={stats.usersCount}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: "#1DB954" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Bài hát"
                                value={stats.songsCount}
                                valueStyle={{ color: "#3ea6c1" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Album"
                                value={stats.albumsCount}
                                valueStyle={{ color: "#ff7875" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Thể loại"
                                value={stats.genresCount}
                                prefix={<BgColorsOutlined />}
                                valueStyle={{ color: "#ffc069" }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

export default Dashboard;
