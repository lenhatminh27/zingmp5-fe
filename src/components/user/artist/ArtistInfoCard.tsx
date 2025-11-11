import React from 'react';
import type {IArtist} from '../../../types/model.type';
import {Link} from 'react-router-dom';
import {UserAddOutlined} from '@ant-design/icons';
import {Button} from 'antd';

type Props = {
    artist: IArtist;
};

const ArtistInfoCard: React.FC<Props> = ({artist}) => {
    const artistProfileId = typeof artist.userId === 'object' ? artist.userId._id : artist.userId;

    const stats = [
        {label: 'Followers', value: artist.followerCount ?? 0},
        {label: 'Following', value: artist.followingCount ?? 0},
        {label: 'Tracks', value: artist.songs?.length ?? 0},
    ];

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <div className="flex items-center gap-4">
                <Link to={`/profile/${artistProfileId}`}>
                    <img
                        src={artist.userId.avatar}
                        alt={artist.stageName}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                </Link>
                <div className="min-w-0">
                    <Link to={`/profile/${artistProfileId}`} className="font-bold text-lg hover:underline truncate">
                        {artist.stageName}
                    </Link>
                </div>
            </div>

            <div className="flex justify-around text-center my-4">
                {stats.map(stat => (
                    <div key={stat.label}>
                        <div className="text-xs text-neutral-400">{stat.label}</div>
                        <div className="font-semibold text-sm">{stat.value.toLocaleString()}</div>
                    </div>
                ))}
            </div>

            <Button type="primary" icon={<UserAddOutlined/>} block>
                Follow
            </Button>
        </div>
    );
};

export default ArtistInfoCard;