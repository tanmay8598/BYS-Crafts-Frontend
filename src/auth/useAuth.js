// import { useContext } from "react";
// import AuthContext from "./context";
// import { jwtDecode } from "jwt-decode";

// const useAuth = () => {
//   const { user, setUser } = useContext(AuthContext);

//   const logIn = (authToken) => {
//     if (!authToken) return;
//     const decodedUser = jwtDecode(authToken);
    
//     const userData = {
//       ...decodedUser,
//        id: decodedUser.id || decodedUser._id,
     
//     };
    
//     setUser(userData);
//     localStorage.setItem("token", authToken);
//     document.cookie = `token=${authToken}; path=/; max-age=2592000`;
//   };

//   const logOut = () => {
//     setUser(null);
//     localStorage.removeItem("token");
//     document.cookie = "token=; path=/; max-age=0";
//   };

 
//   const updateUser = (userData) => {
//     setUser(prevUser => ({
//       ...prevUser,
//       ...userData
//     }));
//   };

//   return { user, logIn, logOut, updateUser };
// };

// export default useAuth;

"use client";

import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "./context";
import apiClient from "@/api/client";
import { setAuthCookie, clearAuthCookie } from "./authCookie";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = (accessToken, refreshToken) => {
    if (!accessToken) return;

    const decoded = jwtDecode(accessToken);
    const userData = {
      ...decoded,
      id: decoded.id || decoded._id,
    };

    setUser(userData);
    localStorage.setItem("token", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

    setAuthCookie(accessToken);
  };

  const logOut = async () => {
    try {
      await apiClient.post("/user/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      clearAuthCookie();

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  return { user, logIn, logOut, updateUser, getAccessToken };
};

export default useAuth;