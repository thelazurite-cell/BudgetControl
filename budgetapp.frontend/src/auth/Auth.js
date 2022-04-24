import React, { useContext, createContext, useState } from "react";
import { AuthCookie } from "./AuthCookie.js";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const cookie = new AuthCookie();

  const signin = (cb) => {
    const result = cookie.checkTokenCookie();
    const signedIn = result && result.signedIn;
    if (signedIn) {
      console.log(result);
      setUser(result.user);
      setToken(result.token);
    }
    if (cb) {
      cb(signedIn);
    }
  };

  const signout = (cb) => {
    cookie.clearToken();
    setUser(null);
    setToken(null);
    if (cb) {
      cb();
    }
  };

  return {
    user,
    token,
    signin,
    signout,
  };
}
