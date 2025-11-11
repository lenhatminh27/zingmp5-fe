import React from 'react';
import type {IAccount, IArtist} from "../../../types/model.type.ts";
import {Avatar} from "antd";
import {UserOutlined} from "@ant-design/icons";

type Props = {
    profile: IArtist | IAccount;
};

const isArtist = (profile: IArtist | IAccount): profile is IArtist => {
    return 'stageName' in profile;
};

const ProfileHeader: React.FC<Props> = ({profile}) => {
    const bannerUrl = isArtist(profile) ? profile.bannerUrl : null;
    const avatarUrl = isArtist(profile) ? profile.avatarUrl : profile.avatar;
    const displayName = isArtist(profile) ? profile.stageName : profile.email;
    const location = isArtist(profile) ? profile.location : 'Music Lover';

    const defaultBanner = 'linear-gradient(90deg, #2a2a2a, #1a1a1a)';

    return (
        <div>
            {/* Banner */}
            <div
                className="h-52 md:h-64 bg-cover bg-center"
                style={{background: bannerUrl ? `url(${bannerUrl})` : defaultBanner}}
            />

            {/* Avatar & Info */}
            <div className="px-6 -mt-16 md:-mt-20">
                <div className="flex flex-col md:flex-row items-end gap-4">
                    <Avatar
                        src={avatarUrl}
                        alt={displayName}
                        className="!w-32 !h-32 md:!w-40 md:!h-40 !rounded-full !object-cover !border-4 !border-black !bg-neutral-800"
                    ><UserOutlined size={30} className={'!w-full !h-full !scale-[400%]'}/></Avatar>
                    <div className="flex-1 pb-2">
                        <h1 className="text-3xl font-bold">{displayName}</h1>
                        <p className="text-neutral-400">{location}</p>
                    </div>

                    {/* Stats for Artists */}
                    {isArtist(profile) && (
                        <div className="flex gap-4 text-sm pb-2">
                            <div className="text-center">
                                <div className="font-bold">Followers</div>
                                <div className="text-neutral-300">{(profile.followerCount ?? 0).toLocaleString()}</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold">Following</div>
                                <div className="text-neutral-300">{(profile.followingCount ?? 0).toLocaleString()}</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold">Tracks</div>
                                <div className="text-neutral-300">{(profile.songs?.length ?? 0)}</div>
                            </div>
                        </div>
                    )}
                </div>

                {isArtist(profile) && profile.bio && (
                    <p className="mt-4 text-neutral-300 max-w-3xl">{profile.bio}</p>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;