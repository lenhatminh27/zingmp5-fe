import React from 'react';
import type {IArtist} from "../../../types/model.type.ts";
import {Avatar} from "antd";
import {UserOutlined} from "@ant-design/icons";

type Props = {
    artist: IArtist;
};

const ArtistCard: React.FC<Props> = ({artist}) => {
    const avatar = artist.userId.avatar;

    return (
        <div className="flex items-center justify-between p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <div className="flex items-center gap-3 min-w-0">
                <Avatar
                    src={avatar}
                    alt={artist.stageName}
                    icon={<UserOutlined className={'!text-black'}/>}
                    className="!w-12 !h-12 !aspect-square rounded-full object-cover !bg-white"
                />
                <div className="min-w-0">
                    <p className="font-semibold truncate">{artist.stageName}</p>
                    <p className="text-xs text-neutral-400">
                        {(artist.followerCount ?? 0).toLocaleString()} followers
                    </p>
                </div>
            </div>
            <button
                className="shrink-0 ml-2 px-3 py-1 text-xs font-semibold border border-neutral-600 rounded-full hover:border-white transition-colors">
                Follow
            </button>
        </div>
    );
};

export default ArtistCard;