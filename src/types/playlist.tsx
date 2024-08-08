import { Song } from "./song";

export interface PlaylistEntry {
  id?: number;
  created_at?: string;
  updated_at?: string;
  order?: number;
  playlist?: number;
  song: number;
  owner: number;
}

export interface Playlist {
  id?: number;
  created_at?: string;
  updated_at?: string;
  name: string;
  description: string;
  public?: boolean;
  owner?: number;
  entries?: Song[];
}

export interface PlaylistResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
}
