import { useCallback, useEffect, useState } from 'react';
import { videos as builtInVideos, type HumorVideo } from '@/data/videos';

const STORAGE_KEY = 'porzhali-user-videos-v1';

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

export function useVideos() {
  const [userVideos, setUserVideos] = useState<HumorVideo[]>([]);

  useEffect(() => {
    setUserVideos(readSavedVideos());
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
    videos: [...userVideos, ...builtInVideos],
    userVideos,
    addVideo,
    removeVideo,
  };
}
