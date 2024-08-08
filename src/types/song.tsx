export interface Song {
  id?: number;
  created_at?: string;
  updated_at?: string;
  title: string;
  year?: number | string | null;
  duration?: string | null;
  song_file?: File | string | null;
  album?: number;
  owner?: number;
  artists?: number[];
  genres?: number[];
}

export interface PlayerModalProps {
  song: Song;
  show: boolean;
  onClose: () => void;
}
