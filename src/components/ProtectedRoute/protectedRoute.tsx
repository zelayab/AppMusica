// components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSimulatedLoading } from "../../hooks/useSimulatedLoading";
import LoadingSpinner from "../Spinner/LoadingSpinner";

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { state } = useAuth();
  const loading = useSimulatedLoading();

  if (loading) {
    return <LoadingSpinner />;
  }

  return state.token ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
