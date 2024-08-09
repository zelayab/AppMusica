import axios from "axios";
import { Playlist, PlaylistResponse } from "../types/playlist";
import { Song } from "../types/song";
import { Pagination } from "../types/utils";

// Crear instancia de Axios
export const api = axios.create({
  baseURL: "https://sandbox.academiadevelopers.com/",
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// Configurar interceptores para agregar encabezados a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }

    const csrfToken = localStorage.getItem("csrfToken");
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Función para obtener la última canción agregada
export const getLastAddedSong = async () => {
  const songs = await getSongs();
  return songs[songs.length - 1];
};

// **ALBUMS**
export const albums = () => api.get("harmonyhub/albums");
export const createAlbum = (data: any) => api.post("harmonyhub/albums", data);
export const updateAlbum = (id: number, data: any) =>
  api.put(`harmonyhub/albums/${id}`, data);
export const deleteAlbum = (id: number) =>
  api.delete(`harmonyhub/albums/${id}`);
export const patchAlbum = (id: number, data: any) =>
  api.patch(`harmonyhub/albums/${id}`, data);

// **SONGS**

// Función para obtener todas las canciones manejando la paginaciónexport const getSongs = async () => {
export const getSongs = async () => {
  let allSongs: Song[] = [];
  let nextPage: string | null = "harmonyhub/songs/";

  while (nextPage) {
    try {
      const response = await api.get(nextPage);
      const { next, results } = response.data;

      console.log("Results:", results);
      console.log("Next URL:", next);

      allSongs = [...allSongs, ...results];

      if (next) {
        try {
          const url: URL = new URL(next, api.defaults.baseURL);
          url.protocol = "https:"; // Asegúrate de que sea HTTPS
          nextPage = url.pathname + url.search; // Asegúrate de que nextPage sea relativo
          console.log("Fixed URL:", nextPage);
        } catch (error) {
          console.error("Error construyendo la URL de paginación:", error);
          nextPage = null;
        }
      } else {
        nextPage = null; // No hay más páginas
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      nextPage = null; // Detener la paginación en caso de error
    }
  }

  return allSongs;
};

export const createSong = async (formData: FormData) => {
  try {
    const response = await api.post("harmonyhub/songs/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// hay que recordar que tb se pasa la canción en mp3 en el formData
export const updateSong = async (id: number, formData: FormData) => {
  try {
    const response = await api.put(`harmonyhub/songs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Esto se puede omitir, Axios lo maneja
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la canción:", error);
    throw error; // Maneja el error como prefieras
  }
};

export const deleteSong = (id: number) => api.delete(`harmonyhub/songs/${id}`);
export const patchSong = (id: number, data: any) =>
  api.patch(`harmonyhub/songs/${id}`, data);

// **ARTISTS**
// Función para obtener todos los artistas manejando la paginación
export const getArtists = async (page: number, pageSize: number) => {
  try {
    const response = await api.get("harmonyhub/artists/", {
      params: {
        page,
        pageSize,
      },
    });

    // Obtener los datos de la respuesta
    const { count, next, previous, results } = response.data;

    const pagination:
      | {
          count: number;
          nextPage: number | null;
          previousPage: number | null;
        }
      | any = {
      count,
      nextPage: next ? new URL(next).searchParams.get("page") : null,
      previousPage: previous
        ? new URL(previous).searchParams.get("page")
        : null,
    };

    return {
      results,
      pagination,
    };
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw error;
  }
};

export const getArtist = (id: number) => api.get(`harmonyhub/artists/${id}`);
export const createArtist = async (data: any) => {
  try {
    const response = await api.post("harmonyhub/artists/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating artist:", error);
    throw error; // Maneja el error como prefieras
  }
};

export const updateArtist = (id: number, data: any) =>
  api.put(`harmonyhub/artists/${id}`, data);
export const deleteArtist = (id: number) =>
  api.delete(`harmonyhub/artists/${id}`);
export const patchArtist = (id: number, data: any) =>
  api.patch(`harmonyhub/artists/${id}`, data);

// **GENRES**
export const getGenres = () => api.get("harmonyhub/genres");
export const createGenre = (data: any) => api.post("harmonyhub/genres", data);
export const updateGenre = (id: number, data: any) =>
  api.put(`harmonyhub/genres/${id}`, data);
export const deleteGenre = (id: number) =>
  api.delete(`harmonyhub/genres/${id}`);
export const patchGenre = (id: number, data: any) =>
  api.patch(`harmonyhub/genres/${id}`, data);

// **PLAYLIST ENTRIES**
export const getPlaylistEntries = () => api.get("harmonyhub/playlist-entries");
export const getPlaylistEntry = (id: number) =>
  api.get(`harmonyhub/playlist-entries/${id}`);
export const createPlaylistEntry = (data: any) =>
  api.post("harmonyhub/playlist-entries", data);
export const updatePlaylistEntry = (id: number, data: any) =>
  api.put(`harmonyhub/playlist-entries/${id}`, data);
export const deletePlaylistEntry = (id: number) =>
  api.delete(`harmonyhub/playlist-entries/${id}`);
export const patchPlaylistEntry = (id: number, data: any) =>
  api.patch(`harmonyhub/playlist-entries/${id}`, data);

// **PLAYLISTS**
export const getPlaylists = async (
  url: string = "harmonyhub/playlists",
  page: number = 1,
  pageSize: number = 10
): Promise<{ results: any[]; pagination: Pagination }> => {
  try {
    const response = await api.get<PlaylistResponse>(url, {
      params: {
        page,
        pageSize,
      },
    });

    const { count, next, previous, results } = response.data;

    const pagination: Pagination = {
      count,
      nextPage: next
        ? parseInt(new URL(next).searchParams.get("page") || "1")
        : null,
      previousPage: previous
        ? parseInt(new URL(previous).searchParams.get("page") || "1")
        : null,
    };

    return {
      results,
      pagination,
    };
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
};

export const getAllPlaylists = async (): Promise<Playlist[]> => {
  let allPlaylists: Playlist[] = [];
  let page = 1;
  const pageSize = 10; // O el tamaño de página que estés usando

  while (true) {
    const { results, pagination } = await getPlaylists(
      "harmonyhub/playlists",
      page,
      pageSize
    );

    allPlaylists = [...allPlaylists, ...results];

    if (pagination.nextPage === null) {
      break; // No hay más páginas
    }

    page = pagination.nextPage as number;
  }

  return allPlaylists;
};

export const getPlaylist = (id: number) =>
  api.get(`harmonyhub/playlists/${id}`);
export const createPlaylist = (data: any) => {
  return api.post("harmonyhub/playlists", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
};
export const updatePlaylist = (id: number, data: any) =>
  api.put(`harmonyhub/playlists/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
export const deletePlaylist = (id: number) =>
  api.delete(`harmonyhub/playlists/${id}`);
export const patchPlaylist = (id: number, data: any) =>
  api.patch(`harmonyhub/playlists/${id}`, data);
