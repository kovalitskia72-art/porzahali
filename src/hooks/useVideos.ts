import { useCallback, useEffect, useState } from 'react';
import { videos as builtInVideos, type HumorVideo } from '@/data/videos';

const STORAGE_KEY = 'porzhali-user-videos-v1';

const SUPABASE_URL = 'https://vcenzgymannotxytjizj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_90NFibKR8zhaMfB0-02YnA_8N2Dpq7U';

type DatabaseVideo = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  source: string;
  date: string;
  emoji: string | null;
  featured: boolean;
  is_fresh: boolean;
  sort_order: number;
  created_at: string;
};

function readSavedVideos(): HumorVideo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function convertDatabaseVideo(video: DatabaseVideo): HumorVideo {
  return {
    id: video.id,
    title: video.title,
    description: video.description ?? '',
    url: video.url,
    source: video.source,
    date: video.date,
    emoji: video.emoji ?? '🎬',
    featured: video.featured,
    isFresh: video.is_fresh,
  } as unknown as HumorVideo;
}

async function loadVideosFromSupabase(): Promise<HumorVideo[]> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/videos?select=*&order=sort_order.asc,created_at.asc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status}`);
  }

  const data = (await response.json()) as DatabaseVideo[];
  return data.map(convertDatabaseVideo);
}

export function useVideos() {
  const [userVideos, setUserVideos] = useState<HumorVideo[]>([]);
  const [remoteVideos, setRemoteVideos] =
    useState<HumorVideo[]>(builtInVideos);

  useEffect(() => {
    setUserVideos(readSavedVideos());

    loadVideosFromSupabase()
      .then(setRemoteVideos)
      .catch((error) => {
        console.error('Не удалось загрузить видео из Supabase:', error);
        setRemoteVideos(builtInVideos);
      });
  }, []);

  const addVideo = useCallback((video: HumorVideo) => {
    setUserVideos((current) => {
      const next = [video, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeVideo = useCallback((id: string) => {
    setUserVideos((current) => {
      const next = current.filter((video) => video.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    videos: [...userVideos, ...remoteVideos],
    userVideos,
    addVideo,
    removeVideo,
  };
}
