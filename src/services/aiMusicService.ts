import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration
const GEMINI_API_KEY = 'AIzaSyCMT8W4Z8HWYgJoFNRekF9IfgqimuOTfNU';
const MUSIC_GPT_API_KEY = '8S5qdYk5Xwy1kk0zsc1tQ5rO26iOTtfod92jmEI4sBEj8a1xxNYAeZi821NWBfHElFU6UTxJtyjSGhrgsEZFvQ';
const MUSIC_GPT_ENDPOINT = 'https://api.musicgpt.com/api/public/v1';

// Type definitions
export interface GenerateSongParams {
  description: string;
  prompt?: string;
  music_style?: string;
  make_instrumental?: boolean;
  vocal_only?: boolean;
  voice_id?: string;
  webhook_url?: string;
  lyrics?: string;
}

export interface GeneratedSong {
  title: string;
  lyrics: string;
  audioUrl: string;
  duration: number;
  style: string;
  taskId?: string;
  conversionId?: string;
}

export interface MusicGPTResponse {
  task_id?: string;
  conversion_id_1?: string;
  conversion_id_2?: string;
  [key: string]: unknown;
}

export interface StatusResponse {
  conversion?: {
    status: string;
    title_1?: string;
    title_2?: string;
    title?: string;
    music_style?: string;
    conversion_duration_1?: number;
    conversion_duration_2?: number;
    conversion_path_1?: string;
    conversion_path_2?: string;
    album_cover_path?: string;
    album_cover_thumbnail?: string;
    lyrics_1?: string;
    lyrics_2?: string;
    lyrics?: string;
    conversion_id_1?: string;
    conversion_id_2?: string;
  };
  [key: string]: unknown;
}

/**
 * Generate lyrics from description using Gemini API
 */
async function generateLyricsFromDescription(description: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    // Fallback lyrics if no Gemini key
    return `Title: Untitled\n\n[Verse 1]\n${description}\n\n[Chorus]\n${description}\n\n[Verse 2]\n${description}`;
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = [
      'You are a professional songwriter. Based on the following description, write full song lyrics.',
      'Include sections like [Verse], [Chorus], [Bridge] where appropriate.',
      'Return only the lyrics text, no extra commentary, just demo.',
      `Description: ${description}`
    ].join('\n');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('[aiMusicService] Error generating lyrics:', error);
    throw new Error('Failed to generate lyrics');
  }
}

/**
 * Request music generation from MusicGPT API
 */
async function requestMusicGeneration(params: GenerateSongParams): Promise<MusicGPTResponse> {
  if (!MUSIC_GPT_API_KEY) {
    throw new Error('MUSIC_GPT_API_KEY is not configured');
  }

  try {
    const url = `${MUSIC_GPT_ENDPOINT}/MusicAI`;
    const payload = {
      prompt: params.prompt || '',
      music_style: params.music_style || '',
      lyrics: params.lyrics || '',
      make_instrumental: Boolean(params.make_instrumental),
      vocal_only: Boolean(params.vocal_only),
      voice_id: params.voice_id || '',
      webhook_url: params.webhook_url || ''
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: MUSIC_GPT_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('[aiMusicService] Error requesting music generation:', error);
    throw new Error('Failed to request music generation');
  }
}

/**
 * Get conversion status by ID
 */
async function getConversionById(id: string, idType: 'conversion_id' | 'task_id' = 'conversion_id'): Promise<StatusResponse> {
  if (!MUSIC_GPT_API_KEY) {
    throw new Error('MUSIC_GPT_API_KEY is not configured');
  }

  if (!id) {
    throw new Error('Conversion ID is required');
  }

  try {
    const paramName = idType === 'task_id' ? 'task_id' : 'conversion_id';
    const url = `${MUSIC_GPT_ENDPOINT}/byId?conversionType=MUSIC_AI&${paramName}=${encodeURIComponent(id)}`;

    const response = await axios.get(url, {
      headers: { Authorization: MUSIC_GPT_API_KEY }
    });

    console.log('[aiMusicService] Status check successful:', { id, idType, status: response.data?.conversion?.status });
    return response.data;
  } catch (error) {
    console.error('[aiMusicService] Error checking status:', error);
    throw error;
  }
}

/**
 * Poll for generation completion
 */
async function pollForCompletion(
  taskId?: string,
  conv1?: string,
  conv2?: string,
  maxAttempts: number = 60,
  intervalMs: number = 30000,
  onProgress?: (step: number, message: string) => void
): Promise<StatusResponse['conversion'] | null> {
  const pollCandidates = [
    { id: taskId, type: 'task_id' as const },
    { id: conv1, type: 'conversion_id' as const },
    { id: conv2, type: 'conversion_id' as const }
  ].filter((c): c is { id: string; type: 'task_id' | 'conversion_id' } => !!c.id);

  if (pollCandidates.length === 0) {
    throw new Error('No valid conversion IDs provided');
  }

  for (const candidate of pollCandidates) {
    console.log('[aiMusicService] Starting poll with:', candidate);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        onProgress?.(4, `Polling attempt ${attempt + 1}/${maxAttempts}...`);
        const statusRes = await getConversionById(candidate.id, candidate.type);
        const conv = statusRes?.conversion;

        if (conv?.status === 'COMPLETED') {
          if (conv?.conversion_path_1 || conv?.conversion_path_2) {
            console.log('[aiMusicService] Generation completed!');
            return conv;
          }
        }

        console.log(`[aiMusicService] Attempt ${attempt + 1}: Status = ${conv?.status}`);
      } catch (error: unknown) {
        const statusCode = (error as { response?: { status: number } })?.response?.status;
        if (statusCode === 422) {
          console.warn('[aiMusicService] 422 error - trying next candidate');
          break;
        }
        console.warn('[aiMusicService] Poll error on attempt', attempt + 1, error);
      }

      if (attempt < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }
  }

  return null;
}

/**
 * Complete song generation flow
 */
async function generateSongFlow(
  params: GenerateSongParams,
  onProgress?: (step: number, message: string) => void
): Promise<GeneratedSong> {
  try {
    // Step 1: Generate lyrics
    onProgress?.(1, 'Generating lyrics with Gemini...');
    const lyrics = await generateLyricsFromDescription(params.description);
    console.log('[aiMusicService] Lyrics generated, length:', lyrics.length);

    // Step 2-3: Request music generation
    onProgress?.(3, 'Submitting to MusicGPT...');
    const requestResponse = await requestMusicGeneration({
      ...params,
      prompt: params.prompt || params.description,
      lyrics
    });

    const taskId = requestResponse.task_id;
    const conv1 = requestResponse.conversion_id_1;
    const conv2 = requestResponse.conversion_id_2;

    if (!conv1 && !conv2 && !taskId) {
      throw new Error('MusicGPT did not return conversion IDs');
    }

    // Step 4-6: Poll for completion
    onProgress?.(4, 'Waiting for MusicGPT to finish...');
    const finalConversion = await pollForCompletion(taskId, conv1, conv2, 60, 30000, onProgress);

    if (!finalConversion) {
      throw new Error('Music generation timed out');
    }

    // Step 7: Extract song data
    onProgress?.(7, 'Finalizing...');
    const song: GeneratedSong = {
      title: finalConversion.title_1 || finalConversion.title_2 || finalConversion.title || 'Generated Song',
      lyrics: finalConversion.lyrics_1 || finalConversion.lyrics_2 || finalConversion.lyrics || lyrics || '',
      audioUrl: finalConversion.conversion_path_1 || finalConversion.conversion_path_2 || '',
      duration: Math.round(
        finalConversion.conversion_duration_1 || finalConversion.conversion_duration_2 || 0
      ),
      style: finalConversion.music_style || params.music_style || 'AI Generated',
      taskId: taskId || '',
      conversionId: finalConversion.conversion_id_1 || finalConversion.conversion_id_2 || conv1 || conv2 || ''
    };

    console.log('[aiMusicService] Song generation complete:', song);
    return song;
  } catch (error) {
    console.error('[aiMusicService] Error in generateSongFlow:', error);
    throw error;
  }
}

const aiMusicService = {
  generateLyricsFromDescription,
  requestMusicGeneration,
  getConversionById,
  pollForCompletion,
  generateSongFlow
};

export default aiMusicService;

