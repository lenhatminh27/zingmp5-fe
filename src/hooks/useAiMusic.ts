import { useState } from 'react';
import aiMusicService from '../services/aiMusicService';
import type { GeneratedSong, GenerateSongParams } from '../services/aiMusicService';

export interface GenerationProgress {
  step: number;
  message: string;
}

export interface UseAiMusicReturn {
  isGenerating: boolean;
  progress: GenerationProgress;
  error: string | null;
  generatedSong: GeneratedSong | null;
  generateSong: (params: GenerateSongParams) => Promise<GeneratedSong>;
  resetError: () => void;
  resetGeneration: () => void;
}

export const useAiMusic = (): UseAiMusicReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({ step: 0, message: '' });
  const [error, setError] = useState<string | null>(null);
  const [generatedSong, setGeneratedSong] = useState<GeneratedSong | null>(null);

  const generateSong = async (params: GenerateSongParams): Promise<GeneratedSong> => {
    setIsGenerating(true);
    setError(null);
    setGeneratedSong(null);
    setProgress({ step: 0, message: '' });

    try {
      const song = await aiMusicService.generateSongFlow(params, (step, message) => {
        setProgress({ step, message });
      });

      setGeneratedSong(song);
      return song;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate music. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  const resetGeneration = () => {
    setIsGenerating(false);
    setProgress({ step: 0, message: '' });
    setError(null);
    setGeneratedSong(null);
  };

  return {
    isGenerating,
    progress,
    error,
    generatedSong,
    generateSong,
    resetError,
    resetGeneration
  };
};

