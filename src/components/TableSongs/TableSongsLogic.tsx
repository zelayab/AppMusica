import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteSong, getSongs } from "../../services/api";
import { Song } from "../../types/song";

export const useSongsLogic = () => {
  const [currentSongs, setCurrentSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [newSong, setNewSong] = useState<Song>({
    title: "",
    year: 0,
    song_file: File as any,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 10;

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    setFilteredSongs(
      currentSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (song.owner &&
            song.owner
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      )
    );
    setCurrentPage(1); // Reset page to 1 whenever search term changes
  }, [searchTerm, currentSongs]);

  const fetchSongs = async () => {
    try {
      const response = await getSongs();

      if (Array.isArray(response)) {
        setCurrentSongs(response);
      } else {
        toast.error("No se pudo cargar la lista de canciones");
      }
    } catch (error) {
      toast.error("Error al cargar la lista de canciones");
    }
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleShowEditModal = (song: Song) => {
    setCurrentSong(song);
    setNewSong(song);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleShowDeleteModal = (song: Song) => {
    setCurrentSong(song);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleOpenPlayerModal = (song: Song) => {
    setCurrentSong(song);
    setShowPlayerModal(true);
  };
  const handleClosePlayerModal = () => setShowPlayerModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSong((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const logFormData = (formData: FormData) => {
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        toast.success(`Archivo seleccionado: ${value.name}`);
      } else {
        toast.info(`${key}: ${value}`);
      }
    }
  };

  const handleSave = async () => {
    if (newSong.title && newSong.year) {
      try {
        const formData = new FormData();
        formData.append("title", newSong.title);
        formData.append("year", newSong.year.toString());
        if (newSong.song_file) {
          formData.append("song_file", newSong.song_file);
        }

        logFormData(formData);

        const response = await fetch(
          "https://sandbox.academiadevelopers.com/harmonyhub/songs/",
          {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo crear la canción");
        }

        const data = await response.json();

        data && toast.success("Canción creada correctamente");

        toast.success("Canción creada correctamente");
      } catch (error) {
        console.error("Error al crear la canción:", error);
        toast.error("Error al crear la canción");
      } finally {
        handleCloseAddModal();
        fetchSongs();
      }
    } else {
      toast.error("Por favor, completa todos los campos.");
    }
  };

  const handleEdit = async () => {
    if (newSong.title && newSong.year) {
      try {
        const formData = new FormData();
        formData.append("title", newSong.title);
        formData.append("year", newSong.year.toString());
        if (newSong.song_file instanceof File) {
          formData.append("song_file", newSong.song_file);
        }

        logFormData(formData);

        const response = await fetch(
          `https://sandbox.academiadevelopers.com/harmonyhub/songs/${currentSong?.id}/`,
          {
            method: "PUT",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo actualizar la canción");
        }

        const data = await response.json();

        data && toast.success("Canción actualizada correctamente");

        toast.success("Canción actualizada correctamente");
      } catch (error) {
        toast.error("Error al actualizar la canción");
      } finally {
        handleCloseEditModal();
        fetchSongs();
      }
    } else {
      toast.error("Por favor, completa todos los campos.", {
        position: "top-right",
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (currentSong) {
        await deleteSong(Number(currentSong.id));
        toast.success("Canción eliminada correctamente");
        fetchSongs();
        handleCloseDeleteModal();
      }
    } catch (error) {
      console.error("Error deleting song:", error);
      toast.error("Error al eliminar la canción");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target.files;

    if (fileInput && fileInput[0]) {
      toast.success(`Archivo seleccionado: ${fileInput[0].name}`);
      setNewSong((prev) => ({
        ...prev,
        song_file: fileInput[0],
      }));
    } else {
      toast.error("No se seleccionó ningún archivo");
    }
  };

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongsToShow = filteredSongs.slice(
    indexOfFirstSong,
    indexOfLastSong
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
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
  };
};
