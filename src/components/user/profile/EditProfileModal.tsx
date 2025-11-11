import React, {useEffect, useState} from 'react';
import {Alert, Avatar, Button, Divider, Form, Input, message, Modal, Upload} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import type {IAccount, IArtist} from "../../../types/model.type.ts";
import {useAccounts} from "../../../hooks/useAccounts.ts";
import {useArtists} from "../../../hooks/useArtists.ts";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    profile: IAccount | IArtist;
    onSaveSuccess: () => void;
};

const isArtist = (p: IAccount | IArtist): p is IArtist => 'stageName' in p;

const EditProfileModal: React.FC<Props> = ({isOpen, onClose, profile, onSaveSuccess}) => {
    const [form] = Form.useForm();
    const {updateAccount} = useAccounts();
    const {updateArtist} = useArtists();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const initialAccount = isArtist(profile) ? profile.userId : profile;

    useEffect(() => {
        if (isOpen) {
            form.setFieldsValue({
                email: initialAccount.email,
                stageName: isArtist(profile) ? profile.stageName : '',
                bio: isArtist(profile) ? profile.bio || '' : '',
            });
            setAvatarPreview(initialAccount.avatar || null);
        }
    }, [isOpen, profile, form, initialAccount]);

    const handleBeforeUpload = (file: File, type: 'avatar' | 'banner') => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return Upload.LIST_IGNORE;
        }

        // Tạo preview và lưu file vào state
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (type === 'avatar') {
                setAvatarFile(file);
                setAvatarPreview(reader.result as string);
            } else {
            }
        };

        return false;
    };

    const handleFinish = async (values: any) => {
        setIsSaving(true);
        setError('');

        const apiCalls: Promise<any>[] = [];

        if (isArtist(profile)) {
            const artistPayload: Partial<IArtist> = {};
            if (values.stageName !== profile.stageName) artistPayload.stageName = values.stageName;
            if (values.bio !== (profile.bio || '')) artistPayload.bio = values.bio;

            if (Object.keys(artistPayload).length > 0) {
                apiCalls.push(updateArtist(profile._id, artistPayload));
            }
        }

        const accountPayload: Partial<IAccount> = {};
        if (values.email !== initialAccount.email) accountPayload.email = values.email;
        const accountFiles = {avatar: avatarFile};

        if (Object.keys(accountPayload).length > 0 || accountFiles.avatar) {
            apiCalls.push(updateAccount(initialAccount._id, accountPayload, accountFiles));
        }

        try {
            if (apiCalls.length > 0) {
                await Promise.all(apiCalls);
                message.success('Profile updated successfully!');
            }
            onSaveSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            open={isOpen}
            title="Edit Profile"
            onCancel={onClose}
            width={720}
            footer={[
                <Button key="back" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={isSaving} onClick={() => form.submit()}>
                    Save Changes
                </Button>,
            ]}
        >
            <Form form={form} onFinish={handleFinish} layout="vertical">
                {error && <Alert message={error} type="error" showIcon closable className="mb-4"/>}

                <Divider orientation="left">Account Settings</Divider>

                <Form.Item label="Profile Picture">
                    <div className="flex items-center gap-4">
                        <Avatar src={avatarPreview} alt="Avatar Preview"
                                className="!w-24 !h-24 rounded-full object-cover bg-neutral-700"/>
                        <Upload
                            name="avatar"
                            showUploadList={false}
                            beforeUpload={(file) => handleBeforeUpload(file, 'avatar')}
                        >
                            <Button icon={<UploadOutlined/>}>Change Avatar</Button>
                        </Upload>
                    </div>
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{required: true, type: 'email'}]}>
                    <Input disabled={true}/>
                </Form.Item>

                {isArtist(profile) && (
                    <>
                        <Divider orientation="left">Artist Settings</Divider>

                        <Form.Item name="stageName" label="Display Name" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>

                        <Form.Item name="bio" label="Bio">
                            <Input.TextArea rows={4}/>
                        </Form.Item>
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default EditProfileModal;