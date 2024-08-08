// src/components/NotFoundPage.tsx
import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container className="text-center my-5">
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Button variant="primary" onClick={handleGoHome}>
        Volver a la página principal
      </Button>
    </Container>
  );
};

export default NotFoundPage;
