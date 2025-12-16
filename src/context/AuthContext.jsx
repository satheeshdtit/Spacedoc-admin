import React, { createContext, useContext, useState } from "react";
import { loginAPI } from "../services/authService";
import { signupAPI } from "../services/authService";


const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if the page is being loaded for the first time (not a reload)
    // If it's a new session ("navigate", "back_forward", etc.), we clear the token
    // so the user must sign in again.
    // We only preserve the session if type === 'reload'.
    if (typeof window !== "undefined") {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        const navType = navEntries[0].type;
        if (navType !== "reload") {
          localStorage.removeItem("authUser");
        }
      }
    }
    return JSON.parse(localStorage.getItem("authUser")) || null;
  });

  const login = async (adminname, admin_password) => {
    const data = await loginAPI(adminname, admin_password);

    if (!data?.token) {
      throw new Error("Invalid server response");
    }

    const authData = {
      token: data.token,
      refresh: data.refresh,
      admin: data.admin,
    };

    localStorage.setItem("authUser", JSON.stringify(authData));
    setUser(authData);

    return authData;
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
  };

const signup = async (adminname, email, crypt_id) => {
  const data = await signupAPI(adminname, email, crypt_id);
  return data;
};

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
