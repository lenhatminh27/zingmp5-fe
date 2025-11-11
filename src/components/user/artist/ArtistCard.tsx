import React from 'react';
import type { IArtist } from "../../../types/model.type.ts";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom';

type Props = {
    artist: IArtist;
};

const ArtistCard: React.FC<Props> = ({ artist }) => {
    const avatar = artist.userId.avatar;

    return (
        <Link to={`/profile/${artist.userId._id}`}>
            <div className="flex items-center justify-between p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                        src={avatar}
                        alt={artist.stageName}
                        icon={<UserOutlined className={'!text-black'} />}
                        className="!w-12 !h-12 !aspect-square rounded-full object-cover !bg-white"
                    />
                    <div className="min-w-0">
                        <p className="font-semibold truncate">{artist.stageName}</p>
                        <p className="text-xs text-neutral-400">
                            {(artist.followerCount ?? 0).toLocaleString()} followers
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ArtistCard;