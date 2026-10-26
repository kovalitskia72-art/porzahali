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


const GITHUB_ISSUES_API =
  'https://api.github.com/repos/kovalitskia72-art/porzahali/issues?state=open&creator=kovalitskia72-art&per_page=100';

type EditorialIssue = {
  number: number;
  title: string;
  body: string | null;
  created_at: string;
  user?: { login?: string };
  pull_request?: unknown;
};

// The site is static: only issues created by the repository owner and
// explicitly prefixed with [ВИДЕО] are visible to all visitors.
// Suggestions created by anyone else stay in GitHub for moderation.
function getYouTubeId(link: string): string | null {
  try {
    const url = new URL(link);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase();
    let id: string | null = null;
    if (host === 'youtu.be') {
      id = url.pathname.split('/')[1] ?? null;
    } else if (['www.youtube.com', 'youtube.com', 'm.youtube.com'].includes(host)) {
      id = url.pathname === '/watch'
        ? url.searchParams.get('v')
        : /^\/(shorts|live|embed)\//.test(url.pathname)
          ? url.pathname.split('/')[2] ?? null
          : null;
    }
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

async function loadPublishedGithubVideos(): Promise<HumorVideo[]> {
  const response = await fetch(GITHUB_ISSUES_API, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) throw new Error('GitHub issue feed error: ' + response.status);

  const issues = (await response.json()) as EditorialIssue[];
  if (!Array.isArray(issues)) return [];

  return issues.flatMap((issue): HumorVideo[] => {
    if (
      issue.pull_request ||
      issue.user?.login?.toLowerCase() !== 'kovalitskia72-art' ||
      !issue.title.startsWith('[ВИДЕО] ')
    ) return [];

    const title = issue.title.slice('[ВИДЕО] '.length).trim().slice(0, 120);
    const urlMatch = issue.body?.match(/^Ссылка:\s*(https:\/\/\S+)/m);
    const id = urlMatch ? getYouTubeId(urlMatch[1]) : null;
    if (!title || !id) return [];

    return [{
      id: 'github-video-' + issue.number,
      title,
      description: 'Видео из подборки редакции «ПОРЖАЛИ».',
      url: 'https://www.youtube.com/watch?v=' + id,
      source: 'youtube',
      date: issue.created_at,
      emoji: '🔥',
      featured: true,
    }];
  });
}

function deduplicateVideos(videos: HumorVideo[]): HumorVideo[] {
  const seen = new Set<string>();
  return videos.filter((video) => {
    const videoId = getYouTubeId(video.url);
    const key = videoId ? 'yt:' + videoId : 'id:' + video.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function useVideos() {
  const [userVideos, setUserVideos] = useState<HumorVideo[]>([]);
  const [remoteVideos, setRemoteVideos] =
    useState<HumorVideo[]>(builtInVideos);
  const [publishedVideos, setPublishedVideos] = useState<HumorVideo[]>([]);

  useEffect(() => {
    setUserVideos(readSavedVideos());

    loadVideosFromSupabase()
     .then((loadedVideos) => setRemoteVideos([
  ...builtInVideos,
  ...loadedVideos.filter(
    (video) => !builtInVideos.some((item) => item.id === video.id)
  ),
]))
      .catch((error) => {
        console.error('Не удалось загрузить видео из Supabase:', error);
        setRemoteVideos(builtInVideos);
      });
    loadPublishedGithubVideos()
      .then(setPublishedVideos)
      .catch((error) => {
        console.error('Не удалось загрузить общую видеоленту GitHub:', error);
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
    videos: deduplicateVideos([...userVideos, ...publishedVideos, ...remoteVideos]),
    userVideos,
    addVideo,
    removeVideo,
  };
}
