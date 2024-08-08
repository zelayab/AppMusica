import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Song } from "../../types/song";
import "./PlayerModal.css";

interface PlayerModalProps {
  song: Song | null;
  show: boolean;
  onClose: () => void;
}

const PlayerModal = ({ song, show, onClose }: PlayerModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("pause", handlePause);
      audioElement.addEventListener("ended", handleEnded);

      // Cleanup listeners on unmount
      return () => {
        if (audioElement) {
          audioElement.removeEventListener("play", handlePlay);
          audioElement.removeEventListener("pause", handlePause);
          audioElement.removeEventListener("ended", handleEnded);
        }
      };
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="text-dark"
    >
      <Modal.Header closeButton className="bg-dark text-light">
        <Modal.Title className="text-center">Reproductor de Música</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>Reproducir canción: {song ? song.title : "No title song"}</p>
        {song && song.song_file ? (
          <>
            {isPlaying && (
              <div className="animate-bars animate-bars-center">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i}></div>
                ))}
              </div>
            )}
            <audio ref={audioRef} controls>
              <source
                src={
                  typeof song.song_file === "string"
                    ? song.song_file
                    : undefined
                }
                type="audio/mp3"
              />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </>
        ) : (
          <p>No se encontró archivo de la canción.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PlayerModal;
