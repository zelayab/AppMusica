import React, { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicCard from "../../components/DynamicCard/DynamicCard";
import PaginationComponent from "../../components/PaginationComponent/PaginationComponent";
import { createArtist, getArtists } from "../../services/api";
import { Artist } from "../../types/artist";

const ArtistsList = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newArtistData, setNewArtistData] = useState({
    name: "",
    bio: "",
    website: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [pagination, setPagination] = useState({
    count: 0,
    nextPage: null as number | null,
    previousPage: null as number | null,
  });

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  error && toast.error(error);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewArtistData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateArtist = async () => {
    if (
      newArtistData.website &&
      !newArtistData.website.startsWith("http://") &&
      !newArtistData.website.startsWith("https://")
    ) {
      setNewArtistData({
        ...newArtistData,
        website: `https://${newArtistData.website}`,
      });
    }

    try {
      const data = await createArtist(newArtistData);
      console.log("Respuesta de la API:", data);

      setCurrentPage(1);
      await fetchArtists();

      toast.success("Artista creado correctamente");
      handleCloseModal();
    } catch (error) {
      console.error("Error al crear el artista:", error);
      toast.error("Error al crear el artista. Por favor, intenta más tarde.");
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await getArtists(currentPage, pageSize);
      console.log("Respuesta de la API:", response);
      setArtists(response.results);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error al obtener los artistas:", error);
      setError("Error al obtener los artistas. Por favor, intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container>
      <Row className="d-flex justify-content-md-center">
        <Col md="5">
          <Button variant="primary" onClick={handleShowModal} className="m-3">
            Agregar artista
            <Plus size={20} />
          </Button>
          <Modal
            show={showModal}
            onHide={handleCloseModal}
            className="text-dark"
          >
            <Modal.Header closeButton>
              <Modal.Title>Crear Nuevo Artista</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={newArtistData.name}
                    onChange={handleInputChange}
                    maxLength={255}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">
                    Biografía
                  </label>
                  <textarea
                    className="form-control"
                    id="bio"
                    name="bio"
                    value={newArtistData.bio}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="website" className="form-label">
                    Página web
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="website"
                    name="website"
                    value={newArtistData.website}
                    onChange={handleInputChange}
                    maxLength={200}
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleCreateArtist}>
                Crear Artista
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
        <Col md="7">
          <h1>Artistas</h1>
        </Col>
      </Row>
      <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-3">
        {loading ? (
          <p className="text-center mt-3">Cargando...</p>
        ) : (
          artists.map((artist: Artist) => (
            <Col key={artist.id} className="d-flex justify-content-center">
              <DynamicCard
                title={artist.name}
                imageUrl={
                  "https://images.pexels.com/photos/164829/pexels-photo-164829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                }
                link={`/artists/${artist.id}`}
                linkText="Ver Artista"
              />
            </Col>
          ))
        )}
      </Row>
      <PaginationComponent
        currentPage={currentPage}
        nextPage={pagination.nextPage}
        previousPage={pagination.previousPage}
        paginate={handlePageChange}
      />
    </Container>
  );
};

export default ArtistsList;
