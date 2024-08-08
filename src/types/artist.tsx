export interface ArtistsListResponse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  bio?: string | null;
  website?: string | null;
  owner: number;
  songs: number[];
}

export interface Artist {
  id?: number;
  created_at?: string;
  updated_at?: string;
  name: string;
  bio?: string | null;
  website?: string | null;
  owner?: number;
  songs?: number[];
  imageUrl?: string;
}

export interface ArtistListProps {
  artists: ArtistsListResponse[];
}

export interface ArtistProps {
  artist: Artist;
}
