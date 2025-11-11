import React, { useState, useEffect } from 'react';
import { Alert, Button, Form, Input, message, Modal, Spin } from 'antd';
import { CopyOutlined, PlayCircleOutlined, RobotOutlined, ShakeOutlined } from '@ant-design/icons';
import { useAiMusic } from '../../hooks/useAiMusic';
import { useSongs } from '../../hooks/useSongs';
import { useSelector } from 'react-redux';
import { getId } from '../../store/reducers/auth';
import { useArtists } from '../../hooks/useArtists';
import type { IArtist } from '../../types/model.type';
const MusicGeneratorPage: React.FC = () => {
  const [form] = Form.useForm();
  const userId = useSelector(getId) || '';
  const { isGenerating, progress, error, generatedSong, generateSong, resetGeneration } = useAiMusic();
  const { createSong } = useSongs();
  const { getArtistByUserId } = useArtists();
  const [artist, setArtist] = useState<IArtist | null>(null);
  const [showLyricsModal, setShowLyricsModal] = useState(false);

  useEffect(() => {
    if (userId) {
      getArtistByUserId(userId).then(a => setArtist(a)).catch(() => {
        // User may not have artist profile yet
        setArtist(null);
      });
    }
  }, [userId]);

  const handleGenerateMusic = async (values: Record<string, string>) => {
    if (!values.description?.trim()) {
      message.error('Please describe the music you want to create');
      return;
    }

    try {
      await generateSong({
        description: values.description,
        prompt: values.description,
        music_style: values.style || '',
        make_instrumental: false,
        vocal_only: false
      });
    } catch (err) {
      console.error('Generation error:', err);
    }
  };

  const handleSaveSong = async () => {
    if (!generatedSong || !userId) {
      message.error('Missing required information to save song');
      return;
    }

    // Check if user has artist profile
    if (!artist || !artist._id) {
      message.error('🎤 You must have an artist profile to save songs. Please create one first.');
      return;
    }

    try {
      const songPayload = {
        title: generatedSong.title,
        duration: generatedSong.duration,
        artists: [artist._id],
        genres: ['6912f55b239bf23fbf6b9d55'],
        file_path: generatedSong.audioUrl,
        image: 'https://d1iv5z3ivlqga1.cloudfront.net/wp-content/uploads/2023/11/03110247/Co%CC%82ng-nghe%CC%A3%CC%82-AI-%C4%91u%CC%9Bo%CC%9B%CC%A3c-nhie%CC%82%CC%80u-ga%CC%83-kho%CC%82%CC%89ng-lo%CC%82%CC%80-ve%CC%82%CC%80-co%CC%82ng-nghe%CC%A3%CC%82-quan-ta%CC%82m-nha%CC%82%CC%81t-hie%CC%A3%CC%82n-nay.jpg',
        lyric: generatedSong.lyrics,
        policy: 'AI Generated Music'
      };

      message.loading({ content: 'Saving your AI-generated song...', duration: 0 });
      await createSong(songPayload);
      message.destroy();
      message.success(`🎉 "${generatedSong.title}" saved successfully!`);
      resetGeneration();
      form.resetFields();
      setShowLyricsModal(false);
    } catch (err) {
      message.destroy();
      console.error('Save error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to save song';
      message.error(errorMsg);
    }
  };

  const handlePlaySong = () => {
    if (generatedSong?.audioUrl) {
      const audio = new Audio(generatedSong.audioUrl);
      audio.play().catch(err => {
        console.error('Play error:', err);
        message.error('Failed to play audio');
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Copied to clipboard!');
    }).catch(() => {
      message.error('Failed to copy');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-950 to-black pt-8 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full">
                <ShakeOutlined className="text-3xl text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                AI Music Generator
              </h1>
            </div>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              ✨ Create unique music with AI. Describe your musical vision, and watch it come to life!
            </p>
          </div>

          {/* Info Banner */}
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/40 to-purple-800/30 border border-purple-500/40 rounded-2xl backdrop-blur">
            <div className="flex gap-4">
              <div className="p-3 bg-purple-500/30 rounded-lg flex-shrink-0">
                <RobotOutlined className="text-2xl text-purple-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-purple-200 mb-3">How it works</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-neutral-300">
                  <div className="flex gap-2">
                    <span className="text-purple-400 font-bold">1.</span>
                    <span>Describe the music you want</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-purple-400 font-bold">2.</span>
                    <span>AI generates lyrics</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-purple-400 font-bold">3.</span>
                    <span>AI creates original music</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-purple-400 font-bold">4.</span>
                    <span>Review & save your song</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form or Progress */}
          {!isGenerating && !generatedSong ? (
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 backdrop-blur">
              <Form form={form} onFinish={handleGenerateMusic} layout="vertical">
                {error && (
                  <Alert
                    message="Generation Failed"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    className="mb-4"
                  />
                )}

                <Form.Item
                  name="description"
                  label={<span className="text-white font-semibold">🎵 Describe Your Music</span>}
                  rules={[{ required: true, message: 'Please describe the music' }]}
                >
                  <Input.TextArea
                    rows={6}
                    placeholder="Example: Upbeat pop song about summer love with electric guitars and catchy chorus&#10;&#10;Be specific about:&#10;• Mood (happy, sad, energetic, calm)&#10;• Instruments (guitar, piano, synth, drums)&#10;• Tempo (fast, slow, moderate)&#10;• Genre (pop, rock, jazz, EDM)"
                    className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:text-neutral-500 rounded-lg"
                    style={{
                      backgroundColor: '#1a1a1a',
                      borderColor: '#404040',
                      color: '#fff'
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="style"
                  label={<span className="text-white font-semibold">🎸 Music Style (Optional)</span>}
                >
                  <Input
                    placeholder="e.g., Pop, Rock, Jazz, EDM, Acoustic, etc."
                    className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:text-neutral-500 rounded-lg"
                    style={{
                      backgroundColor: '#1a1a1a',
                      borderColor: '#404040',
                      color: '#fff'
                    }}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  size="large"
                  block
                  className="!bg-gradient-to-r !from-purple-600 !to-purple-500 !border-0 !h-12 !font-bold !text-lg hover:!from-purple-700 hover:!to-purple-600"
                  htmlType="submit"
                  icon={<ShakeOutlined />}
                >
                  ✨ Generate AI Music
                </Button>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-500/40 rounded-lg text-sm text-neutral-300">
                  <div className="flex gap-2">
                    <span className="text-xl">⏱️</span>
                    <div>
                      <strong className="text-blue-300">Generation Time:</strong> Typically 3-5 minutes. The AI will create original music based on your description.
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          ) : null}

          {/* Generation Progress */}
          {isGenerating && (
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-12 backdrop-blur text-center">
              <Spin size="large" tip={false} />
              <h3 className="text-3xl font-bold text-white mt-8 mb-4">
                🎵 Creating Your Music...
              </h3>
              <p className="text-neutral-400 mb-8">
                The AI is working its magic. This typically takes 3-5 minutes.
              </p>

              {/* Progress Bar */}
              <div className="mt-8 mb-6">
                <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden mb-4 shadow-lg">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-purple-400 h-full transition-all duration-500"
                    style={{ width: `${(progress.step / 7) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-purple-300 font-semibold">
                    Step {progress.step} of 7
                  </p>
                  <p className="text-neutral-400 text-sm">
                    {progress.message}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-900/40 border border-purple-500/40 rounded-lg">
                <p className="text-neutral-300 text-sm">
                  ✨ Don't close this window. Your music is being generated...
                </p>
              </div>
            </div>
          )}

          {/* Generated Song Display */}
          {generatedSong && !isGenerating && (
            <div className="bg-gradient-to-br from-purple-900/40 to-neutral-900/80 border border-purple-500/40 rounded-2xl p-8 backdrop-blur">
              <div className="space-y-6">
                {/* Song Info */}
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent mb-4">
                    🎵 {generatedSong.title}
                  </h2>
                  <div className="flex gap-3 flex-wrap">
                    <div className="px-4 py-2 bg-purple-500/40 border border-purple-400/60 rounded-full text-sm text-purple-200 font-semibold">
                      {generatedSong.style}
                    </div>
                    <div className="px-4 py-2 bg-neutral-700/60 border border-neutral-600 rounded-full text-sm text-neutral-300 font-semibold">
                      ⏱️ {generatedSong.duration}s
                    </div>
                  </div>
                </div>

                {/* Audio Player */}
                <div className="bg-neutral-800/60 p-6 rounded-xl border border-neutral-700">
                  <audio
                    controls
                    className="w-full"
                    src={generatedSong.audioUrl}
                  >
                    Your browser does not support audio playback.
                  </audio>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={handlePlaySong}
                    className="!bg-gradient-to-r !from-purple-600 !to-purple-500 !border-0 !h-11 !font-bold"
                  >
                    ▶ Play Preview
                  </Button>
                  <Button
                    size="large"
                    className="!border-purple-500/50 !text-purple-300 !h-11 !font-bold hover:!bg-purple-500/20"
                    onClick={() => setShowLyricsModal(true)}
                  >
                    📝 View Lyrics
                  </Button>
                </div>

                {/* Save Button */}
                <Button
                  type="primary"
                  size="large"
                  block
                  className="!bg-gradient-to-r !from-green-600 !to-emerald-600 !border-0 !h-12 !font-bold !text-white text-lg"
                  onClick={handleSaveSong}
                >
                  ✅ Save to My Library
                </Button>

                {/* Start Over */}
                <Button
                  size="large"
                  block
                  className="!border-neutral-600 !text-neutral-300 !h-11 !font-bold hover:!bg-neutral-800/60"
                  onClick={resetGeneration}
                >
                  🔄 Create Another Song
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Lyrics Modal */}
        <Modal
          title={<span className="text-white text-lg font-bold">📝 Generated Lyrics</span>}
          open={showLyricsModal}
          onCancel={() => setShowLyricsModal(false)}
          width={700}
          centered
          className="!dark"
          modalRender={(modal) => <div className="backdrop-blur-sm">{modal}</div>}
          footer={[
            <Button
              key="copy"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(generatedSong?.lyrics || '')}
              className="!border-purple-500/50 !text-purple-300"
            >
              Copy Lyrics
            </Button>,
            <Button
              key="close"
              type="primary"
              onClick={() => setShowLyricsModal(false)}
              className="!bg-purple-600 !border-purple-600"
            >
              Close
            </Button>
          ]}
          styles={{
            content: {
              backgroundColor: '#1a1a1a',
              borderColor: '#404040'
            },
            header: {
              backgroundColor: '#1a1a1a',
              borderColor: '#404040'
            },
            mask: {
              backdropFilter: 'blur(4px)'
            }
          }}
        >
          <div className="max-h-96 overflow-y-auto bg-neutral-900/60 p-6 rounded-lg text-neutral-100 whitespace-pre-wrap font-mono text-sm leading-7 border border-neutral-800">
            {generatedSong?.lyrics || 'No lyrics available'}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MusicGeneratorPage;

