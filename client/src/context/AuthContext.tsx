import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { AuthContext } from "./auth-context";

type User = {
  id?: string;
  username?: string;
  email?: string;
  token?: string;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios
      .get<{ user: User }>('/api/auth/me')
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post<{ user: User }>('/api/auth/login', {
      email,
      password,
    });

    const nextUser = res.data.user;
    localStorage.setItem("token", nextUser.token ?? "");
    axios.defaults.headers.common["Authorization"] = `Bearer ${nextUser.token ?? ""}`;
    setUser(nextUser);
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await axios.post<{ user: User }>('/api/auth/register', {
      username,
      email,
      password,
    });

    const nextUser = res.data.user;
    localStorage.setItem("token", nextUser.token ?? "");
    axios.defaults.headers.common["Authorization"] = `Bearer ${nextUser.token ?? ""}`;
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
