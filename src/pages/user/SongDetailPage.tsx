import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useSongs} from '../../hooks/useSongs';
import {useComments} from '../../hooks/useComments';
import {type IComment, type ISong} from '../../types/model.type';
import {Alert, Button, Input, message, Spin} from 'antd';
import {getArtistNames} from '../../utils/helpers';
import {useDispatch} from 'react-redux';
import {startPlaying} from '../../store/reducers/player';

const {TextArea} = Input;

const SongDetailPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {getSong} = useSongs();
    const {getComments, createComment} = useComments();
    const dispatch = useDispatch();

    const [song, setSong] = useState<ISong | null>(null);
    const [comments, setComments] = useState<IComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchSongData = async () => {
        if (!id) return;
        try {
            const songData = await getSong(id); // Thay bằng getSong(id) nếu dùng id
            setSong(songData);
            const commentsData = await getComments(songData._id);
            setComments(commentsData);
        } catch (err) {
            setError('Could not load the song. It may have been removed.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSongData();
    }, [id]);

    const handlePlaySong = () => {
        if (song) {
            dispatch(startPlaying({songs: [song], index: 0}));
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !song) return;
        setIsSubmitting(true);
        try {
            await createComment({content: newComment, song_id: song._id});
            setNewComment('');
            message.success('Comment posted!');
            // Tải lại bình luận để hiển thị bình luận mới
            const updatedComments = await getComments(song._id);
            setComments(updatedComments);
        } catch (err) {
            message.error('Failed to post comment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center p-10"><Spin size="large"/></div>;
    if (error) return <div className="p-10"><Alert message="Error" description={error} type="error" showIcon/></div>;
    if (!song) return null;

    const primaryArtist = song.artists && song.artists.length > 0 ? (song.artists[0] as IArtist) : null;
    const artistProfileId = primaryArtist ? (typeof primaryArtist.userId === 'object' ? primaryArtist.userId._id : primaryArtist.userId) : '#';

    return (
        <div className="space-y-8">
            {/* Song Header */}
            <div className="relative h-64 rounded-lg overflow-hidden p-8 flex items-end"
                 style={{background: 'linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)'}}>
                <img src={song.image} alt={song.title}
                     className="absolute inset-0 w-full h-full object-cover opacity-20"/>
                <div className="relative flex items-center gap-8">
                    <img src={song.image} alt={song.title} className="w-48 h-48 rounded-md shadow-lg"/>
                    <div className="flex flex-col gap-2">
                        <Button type="primary" shape="circle" size="large" onClick={handlePlaySong}
                                className="!w-16 !h-16 flex items-center justify-center">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"></path>
                            </svg>
                        </Button>
                        <div>
                            <h2 className="text-4xl font-bold">{song.title}</h2>
                            <Link to={`/profile/${artistProfileId}`}
                                  className="text-2xl text-neutral-300 hover:text-white transition-colors">
                                {getArtistNames(song.artists)}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comment Section */}
            <div className="flex gap-8">
                <div className="flex-1">
                    <h3 className="text-xl font-bold mb-4">{comments.length} Comments</h3>
                    <div className="mb-6">
                        <TextArea
                            rows={3}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <Button type="primary" loading={isSubmitting} onClick={handleCommentSubmit} className="mt-2">
                            Submit
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {comments.map(comment => (
                            <div key={comment._id} className="flex gap-3">
                                {/* TODO: Lấy avatar của người bình luận */}
                                <div className="w-10 h-10 bg-neutral-700 rounded-full shrink-0"></div>
                                <div className="flex-1">
                                    {/* TODO: Lấy tên của người bình luận */}
                                    {/*<p className="font-semibold text-sm">User {comment.account_id.slice(-4)}</p>*/}
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Optional: Artist info sidebar can go here */}
                <div className="w-64 shrink-0">
                    {/* Placeholder for artist card */}
                </div>
            </div>
        </div>
    );
};

export default SongDetailPage;