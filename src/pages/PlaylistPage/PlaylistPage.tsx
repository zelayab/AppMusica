import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import ItemCard from "../../components/ItemCard/ItemCard";
import {
  deletePlaylist,
  getPlaylists,
  updatePlaylist,
} from "../../services/api";
import "./PlaylistPage.css";

interface Playlist {
  id: number;
  name: string;
  description: string;
}

const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
  });
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);

  const fetchAllPlaylists = async () => {
    try {
      let allPlaylists: Playlist[] = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const { results, pagination } = await getPlaylists(
          undefined,
          page,
          100
        );

        allPlaylists = allPlaylists.concat(results);
        hasNextPage = !!pagination.nextPage;
        page++;
      }

      setPlaylists(allPlaylists);
      setFilteredPlaylists(allPlaylists);
    } catch (error) {
      console.error("Error al obtener playlists:", error);
      toast.error("Error al obtener playlists.");
    }
  };

  useEffect(() => {
    fetchAllPlaylists();
  }, []);

  useEffect(() => {
    const filteredPlaylistss = playlists.filter((playlist) => {
      const name = playlist.name.toLowerCase();
      const description = playlist.description?.toLowerCase() || "";
      return (
        name.includes(searchTerm.toLowerCase()) ||
        description.includes(searchTerm.toLowerCase())
      );
    });

    setFilteredPlaylists(filteredPlaylistss);
  }, [searchTerm, playlists]);

  const handleCreate = async () => {
    try {
      const response = await createPlaylist(newPlaylist);
      console.log("API Response:", response);

      if (response && response.name) {
        toast.success("Playlist creada con éxito!");
        fetchAllPlaylists();
      } else {
        console.error("La respuesta no contiene una playlist válida.");
        toast.error("Error en la respuesta al crear la playlist.");
      }

      setShowModal(false);
      setNewPlaylist({ name: "", description: "" });
    } catch (error) {
      console.error("Error al crear playlist:", error);
      toast.error("Error al crear playlist.");
    }
  };

  const createPlaylist = async (playlistData: {
    name: string;
    description: string;
  }) => {
    const response = await fetch(
      "https://sandbox.academiadevelopers.com/harmonyhub/playlists/",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playlistData),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return response.json();
  };

  const handleEdit = async (id: number) => {
    const updatedPlaylist = {
      name: newPlaylist.name,
      description: newPlaylist.description,
    };
    try {
      await updatePlaylist(id, updatedPlaylist);
      setPlaylists(
        playlists.map((playlist) =>
          playlist.id === id ? { ...playlist, ...updatedPlaylist } : playlist
        )
      );
      setShowModal(false);
      setEditingPlaylist(null);
      setNewPlaylist({ name: "", description: "" });
      toast.success("Playlist actualizada con éxito!");
    } catch (error) {
      console.error("Error al actualizar playlist:", error);
      toast.error("Error al actualizar playlist.");
    }
  };

  const handleShowCreateModal = () => {
    setEditingPlaylist(null);
    setNewPlaylist({ name: "", description: "" });
    setShowModal(true);
  };

  const handleShowEditModal = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setNewPlaylist({
      name: playlist.name,
      description: playlist.description,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePlaylist(id);
      setPlaylists(playlists.filter((playlist) => playlist.id !== id));
      toast.success("Playlist eliminada con éxito.");
    } catch (error) {
      console.error("Error al eliminar playlist:", error);
      toast.error("Error al eliminar playlist.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="playlists-page">
      <h2>Playlists</h2>
      <Button variant="primary" onClick={handleShowCreateModal}>
        Crear nueva playlist
      </Button>

      <Form.Control
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="my-3"
      />

      <div className="playlists-container">
        {filteredPlaylists.length > 0 ? (
          filteredPlaylists.map((playlist) => (
            <ItemCard
              key={playlist.id}
              title={playlist.name}
              description={playlist.description}
              onEdit={() => handleShowEditModal(playlist)}
              onDelete={() => handleDelete(playlist.id)}
            />
          ))
        ) : (
          <p>No hay playlists que coincidan con la búsqueda.</p>
        )}
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="text-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingPlaylist ? "Editar Playlist" : "Crear nueva playlist"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPlaylistTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el título"
                value={newPlaylist.name}
                onChange={(e) =>
                  setNewPlaylist({ ...newPlaylist, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPlaylistDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa la descripción"
                value={newPlaylist.description}
                onChange={(e) =>
                  setNewPlaylist({
                    ...newPlaylist,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={
              editingPlaylist
                ? () => handleEdit(editingPlaylist.id)
                : handleCreate
            }
          >
            {editingPlaylist ? "Guardar Cambios" : "Crear"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PlaylistsPage;
