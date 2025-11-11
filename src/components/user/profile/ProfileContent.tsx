import React, {useState} from 'react';
import type {IArtist} from "../../../types/model.type.ts";

type Props = {
    artist: IArtist;
};

const ProfileContent: React.FC<Props> = ({artist}) => {
    const [activeTab, setActiveTab] = useState('tracks');

    const TabButton: React.FC<{ tabName: string; label: string }> = ({tabName, label}) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 font-semibold border-b-2 ${
                activeTab === tabName
                    ? 'border-green-500 text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="px-6 mt-6">
            <div className="border-b border-neutral-800">
                <TabButton tabName="tracks" label="Tracks"/>
                <TabButton tabName="albums" label="Albums"/>
                <TabButton tabName="playlists" label="Playlists"/>
            </div>

            <div className="mt-6">
                {activeTab === 'tracks' && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Latest Tracks</h3>
                        {/*
                          TODO: Fetch và hiển thị danh sách bài hát của nghệ sĩ.
                          Bạn có thể cần tạo một API endpoint mới như `GET /songs?artistId=${artist._id}`
                          hoặc fetch từng bài hát dựa trên mảng artist.songs.
                        */}
                        <p className="text-neutral-500">Track list will be displayed here.</p>
                        {artist.songs && artist.songs.length > 0 ? (
                            <p>{artist.songs.length} tracks found.</p>
                        ) : (
                            <p>This artist hasn't uploaded any tracks yet.</p>
                        )}
                    </div>
                )}
                {activeTab === 'albums' && <p className="text-neutral-500">Albums will be displayed here.</p>}
                {activeTab === 'playlists' && <p className="text-neutral-500">Playlists will be displayed here.</p>}
            </div>
        </div>
    );
};

export default ProfileContent;