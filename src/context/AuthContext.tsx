import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSimulatedLoading } from "../hooks/useSimulatedLoading";

interface AuthState {
  token: string | null | undefined;
  loading: boolean;
}

interface AuthContextProps {
  state: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  state: { token: null, loading: true },
  login: async () => {},
  logout: () => {},
});

const ACTIONS = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
};

const authReducer = (
  state: AuthState,
  action: { type: string; payload?: string }
): AuthState => {
  switch (action.type) {
    case ACTIONS.LOGIN: {
      const token = action.payload;
      return { ...state, token, loading: false };
    }
    case ACTIONS.LOGOUT:
      return { ...state, token: null, loading: false };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const loading = useSimulatedLoading();

  const [state, dispatch] = useReducer(authReducer, {
    token: null,
    loading: loading,
  });

  const login = async (username: string, password: string): Promise<void> => {
    dispatch({ type: ACTIONS.SET_LOADING });
    try {
      const response = await fetch(
        "https://sandbox.academiadevelopers.com/api-auth/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        dispatch({ type: ACTIONS.LOGIN, payload: data.token });
        console.log("Login successful, navigating...");
        navigate("/"); // Solo navega si el login es exitoso
      } else {
        throw new Error("Token no recibido");
      }
    } catch (error: Error | unknown) {
      dispatch({ type: ACTIONS.LOGOUT });
      console.error("Error en login:", error);
      toast.error("Error al iniciar sesión,  usuario o contraseña incorrectos");
    }
  };

  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: ACTIONS.LOGOUT });
    localStorage.removeItem("token");
    toast.success("Sesión cerrada exitosamente");
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch({ type: ACTIONS.LOGIN, payload: token });
    } else {
      dispatch({ type: ACTIONS.LOGOUT });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  return useContext(AuthContext);
};

export default AuthContext;
