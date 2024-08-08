import React from "react";
import { Col, Container, Row, Toast } from "react-bootstrap";
import { EyeFill, EyeSlashFill, PersonCircle } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importa el CSS de react-toastify
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { state } = useAuth();
  const { token } = state;
  const [showToken, setShowToken] = React.useState(false);

  const handleShowToken = () => {
    setShowToken(!showToken);
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      toast.success("Token copiado al portapapeles"); // Muestra el toast de éxito
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h1 className="text-center mt-5">Perfil de usuario</h1>
          <p>
            Usuario {token ? " Autenticado" : " No autenticado"}
            <PersonCircle
              className="m-2"
              size={24}
              color={token ? "green" : "red"}
            />
          </p>
          {token ? (
            <Toast className="mt-3 token-toast">
              <Toast.Header closeButton={false}>
                <strong className="mr-auto">Token</strong>
              </Toast.Header>
              <Toast.Body>
                <div
                  className="d-flex align-items-center justify-content-between"
                  onClick={handleCopyToken}
                >
                  <p className="mb-0 token-text">
                    {showToken ? token : token.replace(/./g, "*")}
                  </p>
                  <span className="ml-2">
                    {showToken ? (
                      <EyeSlashFill onClick={handleShowToken} />
                    ) : (
                      <EyeFill onClick={handleShowToken} />
                    )}
                  </span>
                </div>
              </Toast.Body>
            </Toast>
          ) : (
            <p className="mt-3">No hay usuario autenticado.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
