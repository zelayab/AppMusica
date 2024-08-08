import { useState } from "react";
import { Song } from "../../types/song";
import PlayerModal from "../PlayerModal/PlayerModal";
import "./LastAddedSong.css";

interface LastAddedSongCardProps {
  song: Song | null;
}

const LastAddedSongCard = ({ song }: LastAddedSongCardProps) => {
  const [showPlayer, setShowPlayer] = useState(false);

  // Asegúrate de que el componente no se renderice hasta que haya datos de canción
  if (!song) {
    return (
      <p>No hay información disponible sobre la última canción agregada.</p>
    );
  }

  const handlePlay = () => {
    setShowPlayer(true);
  };

  const handleClose = () => {
    setShowPlayer(false);
  };

  return (
    <div className="last-added-song">
      <div className="song-details">
        <img
          className="song-image"
          src="https://images.pexels.com/photos/3920974/pexels-photo-3920974.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt={song.title}
        />
        <div className="song-info">
          <h4>{song.title}</h4>
          <p>{song.artists}</p>
          {song.song_file ? (
            <button className="btn btn-primary" onClick={handlePlay}>
              Reproducir
            </button>
          ) : (
            <p>No hay archivo cargado</p>
          )}
        </div>
      </div>
      <PlayerModal song={song} show={showPlayer} onClose={handleClose} />
    </div>
  );
};

export default LastAddedSongCard;
