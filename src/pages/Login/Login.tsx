import React, { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/");
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      if (error.response?.status === 401) {
        setError("Usuario o contraseña incorrectos. Inténtalo de nuevo.");
      } else {
        setError("Error al iniciar sesión. Por favor, intenta más tarde.");
      }
    }
  };

  return (
    <Container className="mt-5" style={{ height: "100vh" }}>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2 className="text-center mt-5 mb-3">Iniciar sesión</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu nombre de usuario"
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Iniciar sesión
            </Button>
          </Form>
          {error && (
            <ToastContainer position="bottom-end" className="p-3">
              <Toast
                show={!!error}
                onClose={() => setError("")}
                delay={5000}
                autohide
              >
                <Toast.Header closeButton={false}>
                  <strong className="mr-auto">Error</strong>
                </Toast.Header>
                <Toast.Body className="text-white bg-danger">
                  {error}
                </Toast.Body>
              </Toast>
            </ToastContainer>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
