import { useState, useEffect } from "react";

// Fungsi untuk ambil cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = belum load cookie

  useEffect(() => {
    const userData = getCookie("auth");
    if (userData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userData));
        setUser(parsed);
      } catch (err) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const login = (userData) => {
    document.cookie = `auth=${encodeURIComponent(
      JSON.stringify(userData)
    )}; path=/;`;
    setUser(userData);
  };

  const logout = () => {
    document.cookie = "auth=; Max-Age=0; path=/;";
    setUser(null);
  };

  return { user, login, logout };
}
