import { Spinner } from "react-bootstrap";
import "./LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-overlay">
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" />
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
