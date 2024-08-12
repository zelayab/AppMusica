import { IconPlayerPlayFilled } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PlayerModal from "../../components/PlayerModal/PlayerModal";
import { getPlaylistSongs } from "../../services/api";
import { Song } from "../../types/song";

interface EntrySong {
  data: Song;
}

const PlaylistEntries: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const [songs, setSongs] = useState<EntrySong[]>([]);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const navigate = useNavigate();

  const handleOpenPlayerModal = (song: Song) => {
    setShowPlayerModal(true);
    setCurrentSong(song);
  };

  const handleClosePlayerModal = () => {
    setShowPlayerModal(false);
    setCurrentSong(null);
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const playlistSongs = await getPlaylistSongs(
          parseInt(playlistId || "")
        );
        setSongs(playlistSongs);
      } catch (error) {
        toast.error("Error al obtener canciones de la playlist.");
      }
    };

    fetchSongs();
  }, [playlistId]);

  return (
    <div className="playlist-entries-page">
      <h2>Canciones de la Playlist</h2>
      <Button
        variant="
        primary
      "
        className="m-4 mb-2 mt-0 "
        onClick={() => navigate("/playlists")}
      >
        Volver a Playlists
      </Button>
      {songs.length > 0 ? (
        <Table striped hover className="m-4">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Creador ID</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.data.id}>
                <td>{song.data.title}</td>
                <td>{song.data.owner}</td>
                <td>
                  <Button
                    className="icon"
                    variant="none"
                    onClick={() => handleOpenPlayerModal(song.data)}
                  >
                    <IconPlayerPlayFilled />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p
          className="text-center"
          style={{ marginTop: "2rem", fontSize: "1.5rem" }}
        >
          No hay canciones en esta playlist.
        </p>
      )}

      {/* Renderizar el PlayerModal */}
      <PlayerModal
        show={showPlayerModal}
        onClose={handleClosePlayerModal}
        song={currentSong}
      />
    </div>
  );
};

export default PlaylistEntries;
