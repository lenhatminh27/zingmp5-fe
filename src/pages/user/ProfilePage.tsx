import React, {useEffect, useState} from 'react';
import {useArtists} from '../../hooks/useArtists';
import {useAccounts} from '../../hooks/useAccounts';
import type {IAccount, IArtist} from '../../types/model.type';
import ProfileHeader from "../../components/user/profile/ProfileHeader.tsx";
import ProfileContent from "../../components/user/profile/ProfileContent.tsx";
import {useSelector} from "react-redux";
import {getId} from "../../store/reducers/auth.ts";
import EditProfileModal from "../../components/user/profile/EditProfileModal.tsx";

const ProfilePage: React.FC = () => {
    const userId = useSelector(getId) || ""
    const {getArtistByUserId} = useArtists();
    const {getAccount} = useAccounts();

    const [profileData, setProfileData] = useState<IArtist | IAccount | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const artistData = await getArtistByUserId(userId);
            setProfileData(artistData);
        } catch (artistError) {
            console.warn("Could not fetch artist data, falling back to account data.", artistError);
            try {
                const accountData = await getAccount(userId);
                setProfileData(accountData);
            } catch (accountError) {
                console.error("Could not fetch account data either.", accountError);
                setError("Sorry, we couldn't find that user.");
                setProfileData(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) return;
        fetchProfile().then();
    }, [userId]);

    const isOwnProfile = profileData?._id === userId || profileData?.userId?._id === userId;

    if (isLoading) {
        return <div className="text-center p-10">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    if (!profileData) {
        return <div className="text-center p-10">User not found.</div>;
    }

    // Type guard để xác định loại profile
    const isProfileArtist = 'stageName' in profileData;

    return (
        <div>
            <div className="relative">
                <ProfileHeader profile={profileData}/>
                {isOwnProfile && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="absolute top-4 right-6 bg-black/50 hover:bg-black/70 text-white font-semibold py-2 px-4 border border-neutral-600 rounded-full transition-colors"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
            {isProfileArtist && <ProfileContent artist={profileData as IArtist}/>}

            {isModalOpen && (
                <EditProfileModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    profile={profileData}
                    onSaveSuccess={() => {
                        setIsModalOpen(false);
                        fetchProfile(); // Tải lại dữ liệu sau khi lưu thành công
                    }}
                />
            )}
        </div>
    );
};

export default ProfilePage;