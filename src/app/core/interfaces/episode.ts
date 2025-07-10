export interface Episode {
  id: number;
  title: string;
  description: string;
  img_url: string;
  audio_url: string;
  duration: string;
  posted_on: string;
  season: number;
  episode: number;
  spotify_url: string;
  apple_podcasts_url: string;
  archive: number;
  featured: number;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEpisodeRequest {
  title: string;
  description: string;
  img_url: string;
  audio_url: string;
  duration: string;
  posted_on: string;
  season: number;
  episode: number;
  spotify_url?: string;
  apple_podcasts_url?: string;
  archive?: number;
  featured?: number;
}