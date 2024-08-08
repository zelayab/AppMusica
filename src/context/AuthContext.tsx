import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/Spinner/LoadingSpinner";
import { useSimulatedLoading } from "../hooks/useSimulatedLoading";

interface AuthState {
  token: string | null;
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
    case ACTIONS.LOGIN:
      const token = action.payload ? action.payload : null;
      return { ...state, token, loading: false };
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
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        dispatch({ type: ACTIONS.LOGIN, payload: data.token });
      } else {
        dispatch({ type: ACTIONS.LOGOUT });
      }
    } catch (error) {
      dispatch({ type: ACTIONS.LOGOUT });
    }
  };

  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: ACTIONS.LOGOUT });
    localStorage.removeItem("token");

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
      {state.loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  return useContext(AuthContext);
};

export default AuthContext;
