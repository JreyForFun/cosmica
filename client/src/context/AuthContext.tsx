import { useState, type ReactNode } from "react";
import axios from "axios";
import { AuthContext } from "./auth-context";

type FavoriteMap = {
  apod?: string[];
  elcovek?: string[];
  vibteo?: string[];
};

type User = {
  _id?: string;
  id?: string;
  username?: string;
  email?: string;
  token?: string;
  favorites?: FavoriteMap;
  photoUrl?: string;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const persistAuth = (token?: string, nextUser?: User | null) => {
    const authToken = token ?? "";

    if (authToken) {
      localStorage.setItem("token", authToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }

    if (nextUser) {
      setUser(nextUser);
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const response = await axios.get<{ user: User }>('/api/auth/me');
      setUser(response.data.user);
    } catch {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post<{ accessToken?: string; token?: string; user?: User }>('/api/auth/login', {
        email,
        password,
      });

      const accessToken = res.data.accessToken ?? res.data.token ?? "";
      if (!accessToken) {
        throw new Error('Login failed: no access token returned by server');
      }

      persistAuth(accessToken);
      await refreshUser();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? error.message)
        : error instanceof Error
          ? error.message
          : 'Login failed';

      throw new Error(message);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await axios.post<{ accessToken?: string; token?: string; user?: User }>('/api/auth/register', {
        username,
        email,
        password,
      });

      const accessToken = res.data.accessToken ?? res.data.token ?? "";
      if (!accessToken) {
        throw new Error('Registration failed: no access token returned by server');
      }

      persistAuth(accessToken, res.data.user ?? null);
      await refreshUser();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? error.message)
        : error instanceof Error
          ? error.message
          : 'Registration failed';

      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
