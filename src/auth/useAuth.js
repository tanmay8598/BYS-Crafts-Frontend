import { useContext } from "react";
import AuthContext from "./context";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = (authToken) => {
    if (!authToken) return;
    const decodedUser = jwtDecode(authToken);
    
    const userData = {
      ...decodedUser,
       id: decodedUser.id || decodedUser._id,
     
    };
    
    setUser(userData);
    localStorage.setItem("token", authToken);
    document.cookie = `token=${authToken}; path=/; max-age=2592000`;
  };

  const logOut = () => {
    setUser(null);
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
  };

 
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  return { user, logIn, logOut, updateUser };
};

export default useAuth;