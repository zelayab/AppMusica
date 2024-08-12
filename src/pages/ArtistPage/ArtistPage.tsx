import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ItemCard from "../../components/ItemCard/ItemCard";
import { deleteArtist, getArtist, updateArtist } from "../../services/api";
import "./ArtistPage.css";

interface Artist {
  id: number;
  name: string;
  bio: string;
  website: string;
}

const ArtistPage: React.FC = () => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const { id } = useParams<{ id: string }>();

  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = () => {
    if (artist) {
      setName(artist.name);
      setBio(artist.bio);
      setWebsite(artist.website);
      setShowEditModal(true);
    }
  };

  const handleSave = async () => {
    if (artist) {
      let updatedWebsite = website;

      if (
        updatedWebsite &&
        !updatedWebsite.startsWith("http://") &&
        !updatedWebsite.startsWith("https://")
      ) {
        updatedWebsite = `https://${updatedWebsite}`;
      }

      const updatedArtist = {
        name,
        bio,
        website: updatedWebsite,
      };

      try {
        await updateArtist(artist.id, updatedArtist);
        const response = await getArtist(artist.id);
        setArtist(response.data);
        handleCloseEditModal();
        toast.success("Artista actualizado correctamente");
      } catch (error) {
        console.error("Error al actualizar el artista:", error);
      }
    }
  };

  const handleDeleteArtist = async (id: number) => {
    try {
      await deleteArtist(id);
      setArtist(null);
      toast.success("Artista eliminado correctamente");
      window.location.href = "/artists  ";
    } catch (error) {
      console.error("Error al eliminar el artista:", error);
    }
  };

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await getArtist(Number(id));
        setArtist(response.data);
      } catch (error) {
        console.error("Error al obtener el artista:", error);
      }
    };

    fetchArtist();
  }, [id]);

  return (
    <div className="artist-page">
      <button
        className="btn btn-primary m-3"
        onClick={() => window.history.back()}
      >
        Volver
      </button>
      <h2 className="text-center m-3">Artista</h2>
      <div className="artist-container">
        {artist ? (
          <>
            <ItemCard
              key={artist.id}
              title={artist.name}
              description={artist.bio}
              website={artist.website}
              onEdit={handleShowEditModal}
              onDelete={() => handleDeleteArtist(artist.id)}
              imageUrl="https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=600"
            />
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
              <Modal.Header closeButton>
                <Modal.Title>Editar Artista</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Biografía</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Sitio Web</Form.Label>
                    <Form.Control
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEditModal}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Guardar Cambios
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </div>
  );
};

export default ArtistPage;
