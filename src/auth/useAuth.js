"use client";

import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "./context";
import apiClient from "@/api/client";
import { setAuthCookie, clearAuthCookie } from "./authCookie";
import { setAccessToken , clearAccessToken} from "./accessToken";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  // NOTE: refreshToken is intentionally NOT a parameter.
  // It lives in an httpOnly cookie set by the backend and is never touched by JS.
  const logIn = (accessToken) => {
    if (!accessToken) return;

    const decoded = jwtDecode(accessToken);
    setUser({
      ...decoded,
      id: decoded.id || decoded._id,
    });

    // Only the access token is stored. Refresh token stays in httpOnly cookie.
    // Keep it in memory — see note below about localStorage.
    setAccessToken(accessToken);

    // Non-httpOnly cookie for Next.js middleware route gating only.
    setAuthCookie(accessToken);
  };

  const logOut = async () => {
    try {
      // Backend reads refreshToken from httpOnly cookie and clears it.
      await apiClient.post("/user/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      clearAccessToken();
      clearAuthCookie();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  return { user, logIn, logOut, updateUser };
};

export default useAuth;