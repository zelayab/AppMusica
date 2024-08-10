// App.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import ProtectedRoute from "./components/ProtectedRoute/protectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ArtistPage from "./pages/ArtistPage/ArtistPage";
import ArtistsList from "./pages/ArtistsList/ArtistsList";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import PlaylistEntries from "./pages/PlaylistEntries/PlaylistEntries";
import PlaylistPage from "./pages/PlaylistPage/PlaylistPage";
import Profile from "./pages/Profile/Profile";
import SongTable from "./pages/SongTable/SongTable";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Navigation />
        <div className="RoutesWrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route path="/artists/:id" element={<ArtistPage />} />
            <Route path="/playlists/:id" element={<PlaylistPage />} />
            {/* <Route path="/playlist/:id" element={<PlaylistSongs />} />  */}

            {/*  {/* PROTECTED */}
            <Route
              path="/artists"
              element={<ProtectedRoute element={<ArtistsList />} />}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute element={<Profile />} />}
            />

            <Route
              path="/songs"
              element={<ProtectedRoute element={<SongTable />} />}
            />

            <Route
              path="/playlists"
              element={<ProtectedRoute element={<PlaylistPage />} />}
            />

            <Route
              path="/playlists/:playlistId/entries"
              element={<PlaylistEntries />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
