import { Spinner } from "react-bootstrap";
import "./LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-overlay">
      <div className="spinner-container">
        <span className="sr-only mr-3">Cargando </span>
        <Spinner animation="border" variant="success" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
