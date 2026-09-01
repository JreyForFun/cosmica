import { createContext } from "react";

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

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
