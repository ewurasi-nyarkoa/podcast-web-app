import { Episode } from './episodes';

export interface Playlist {
  id?: number;
  name: string;
  description: string;
  episodes: Episode[];
  created_at?: string;
  updated_at?: string;
}

export interface PlaylistsResponse {
  status: string;
  data: {
    current_page: number;
    data: Playlist[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: any[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface CreatePlaylistRequest {
  title: string;
  description: string;
  episodeIds: number[];
}

export interface UpdatePlaylistRequest {
  id: number;
  title: string;
  description: string;
  episodeIds: number[];
}