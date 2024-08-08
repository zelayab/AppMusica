import { IconEdit, IconPlayerPlayFilled, IconTrash } from "@tabler/icons-react";
import { Alert, Button, Form, Modal, Table } from "react-bootstrap";
import { Song } from "../../types/song";
import PaginationComponent from "../PaginationComponent/PaginationComponent";
import PlayerModal from "../PlayerModal/PlayerModal";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import "./TableSongs.css";
import { useSongsLogic } from "./TableSongsLogic";

const TableSongs = () => {
  const {
    currentSongsToShow,
    currentSong,
    showAddModal,
    showEditModal,
    showDeleteModal,
    showPlayerModal,
    newSong,
    searchTerm,
    currentPage,
    songsPerPage,
    filteredSongs,
    handleShowAddModal,
    handleCloseAddModal,
    handleShowEditModal,
    handleCloseEditModal,
    handleShowDeleteModal,
    handleCloseDeleteModal,
    handleOpenPlayerModal,
    handleClosePlayerModal,
    handleChange,
    handleSearchChange,
    handleSave,
    handleEdit,
    handleDelete,
    handleFileChange,
    paginate,
  } = useSongsLogic();

  const totalPages = Math.ceil(filteredSongs.length / songsPerPage);

  const loading = filteredSongs.length === 0;

  return (
    <>
      <Button variant="primary" onClick={handleShowAddModal} className="my-4">
        Agregar nueva canción
      </Button>
      <Form.Control
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-3"
      />
      {loading && <LoadingSpinner />}
      {!loading && currentSongsToShow.length > 0 ? (
        <div className="table-songs">
          <Table striped bordered hover>
            <thead>
              <tr className="text-white">
                <th>#</th>
                <th className="text-center w-50">Título</th>
                <th>Año</th>
                <th>Creador</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentSongsToShow.map((song: Song, index) => (
                <tr key={song.id}>
                  <td>{index + 1 + (currentPage - 1) * songsPerPage}</td>
                  <td className="text-center w-50 fw-bold">{song.title}</td>
                  <td>{song.year}</td>
                  <td>{song.owner}</td>
                  <td>
                    <Button
                      className="icon"
                      variant="none"
                      onClick={() => handleOpenPlayerModal(song)}
                    >
                      <IconPlayerPlayFilled />
                    </Button>

                    <Button
                      className="icon"
                      variant="none"
                      onClick={() => handleShowEditModal(song)}
                    >
                      <IconEdit />
                    </Button>
                    <Button
                      className="icon"
                      variant="none"
                      onClick={() => handleShowDeleteModal(song)}
                    >
                      <IconTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Alert variant="warning">
          Cargando canciones
          <span className="spinner-border spinner-border-sm ml-3"></span>
        </Alert>
      )}
      <PaginationComponent
        currentPage={currentPage}
        nextPage={currentPage < totalPages ? currentPage + 1 : null}
        previousPage={currentPage > 1 ? currentPage - 1 : null}
        paginate={paginate}
      />
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar nueva canción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newSong.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formYear">
              <Form.Label>Año</Form.Label>
              <Form.Control
                type="number"
                name="year"
                value={newSong.year || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formFile">
              <Form.Label>Archivo de canción</Form.Label>
              <Form.Control
                type="file"
                name="song_file"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar canción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newSong.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formYear">
              <Form.Label>Año</Form.Label>
              <Form.Control
                type="number"
                name="year"
                value={newSong.year || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formFile">
              <Form.Label>Archivo de canción</Form.Label>
              <Form.Control
                type="file"
                name="song_file"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar canción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Estás seguro de que deseas eliminar la canción {currentSong?.title}
            ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
      <PlayerModal
        show={showPlayerModal}
        onClose={handleClosePlayerModal}
        song={currentSong}
      />
    </>
  );
};

export default TableSongs;
