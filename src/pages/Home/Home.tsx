import { useEffect, useState } from "react";
import DynamicCard from "../../components/DynamicCard/DynamicCard";
import LastAddedSong from "../../components/LastAddedSong/LastAddedSong";
import LoadingSpinner from "../../components/Spinner/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useSimulatedLoading } from "../../hooks/useSimulatedLoading";
import { getLastAddedSong } from "../../services/api";
import "./Home.css";

const Home = () => {
  const { state } = useAuth();
  const { token } = state;
  const loading = useSimulatedLoading();
  const [lastSong, setLastSong] = useState(
    JSON.parse(localStorage.getItem("lastSong") || "{}")
  );

  useEffect(() => {
    if (token) {
      getLastAddedSong()
        .then((response) => {
          console.log("Last song:", response);
          setLastSong(response);
        })
        .catch((error) => {
          console.error("Error fetching last song:", error);
        });
    }
  }, [token]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!token && (
        <div className="main-container text-center gap-5">
          <div className="welcome-banner">
            <div className="overlay"></div>
            <div className="content">
              <h1>Bienvenido a Musicfy</h1>
              <p>
                Musicfy es una plataforma donde puedes escuchar tus canciones
                favoritas, crear tus propias listas de reproducción y compartir
                con tus amigos.
              </p>
              <p>
                Para disfrutar de todas las funcionalidades de la plataforma,
                por favor inicia sesión.
              </p>
              <div className="banner">
                <h2>¡Regístrate ahora en Upateco!</h2>
                <p>
                  Crea tu cuenta y disfruta de todas las funcionalidades de
                  Musicfy.
                </p>
                <a
                  className="text-white text-decoration-none ms-1"
                  href="https://upateco.edu.ar/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="btn btn-primary">
                    Ponerme en contacto con Upateco
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {token && (
        <div className="main-container">
          <h2 className="section-title">Explora</h2>
          <div className="list">
            <DynamicCard
              title="Canciones"
              subtitle1="Escucha tus canciones favoritas"
              imageUrl="https://images.pexels.com/photos/3944107/pexels-photo-3944107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              link="/songs"
              linkText="Ver Canciones"
            />
            <DynamicCard
              title="Playlists"
              subtitle1="Escucha tus listas de reproducción"
              imageUrl="https://images.pexels.com/photos/164829/pexels-photo-164829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              link="/playlists"
              linkText="Ver Playlists"
            />
            <DynamicCard
              title="Artistas"
              subtitle1="Descubre a tus artistas favoritos"
              imageUrl="https://images.pexels.com/photos/164829/pexels-photo-164829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              link="/artists"
              linkText="Ver Artistas"
            />
          </div>

          <h2 className="section-title">Última canción agregada</h2>
          <LastAddedSong song={lastSong} />
        </div>
      )}
    </>
  );
};

export default Home;
