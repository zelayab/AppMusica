import { IconLogin, IconLogout, IconUserCircle } from "@tabler/icons-react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navigation.css";

const Navigation = () => {
  const { state, logout } = useAuth();
  const { token } = state;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar">
      <Container>
        <Link to="/" className="navbar-brand">
          <span>Musicfy</span>
          <span className="ms-2">|</span>
          <div className="headphones-icon ms-2">
            <img
              src="../../assets/headphones2.png"
              alt="MusicApp"
              width={50}
              height={50}
              className="headphones-img"
            />
          </div>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto align-items-center">
            {token ? (
              <>
                <Link to="/profile" className="nav-link">
                  <button className="btn btn-primary px-3 d-flex align-items-center gap-2 me-3">
                    Perfil
                    <IconUserCircle className="ms-2" size={20} />
                  </button>
                </Link>

                <button className="btn btn-danger px-3" onClick={logout}>
                  Cerrar sesión
                  <IconLogout className="ms-2" size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link">
                <button className="btn btn-primary px-3 d-flex align-items-center gap-2">
                  Iniciar sesión
                  <IconLogin className="ms-2" size={20} />
                </button>
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
