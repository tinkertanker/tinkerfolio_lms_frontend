import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [auth, setAuth] = useState({
    loading: true,
    isAuthenticated: false,
    tokens: null,
    userType: null,
  });

  useEffect(() => {
    console.log("starting");
    if (localStorage.getItem("tokens") !== null) {
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      const userType = JSON.parse(localStorage.getItem("userType"));
      validateRefreshToken(tokens).then((isValid) => {
        if (isValid) {
          setAuth({
            loading: false,
            isAuthenticated: true,
            tokens: tokens,
            userType: userType,
          });
        } else {
          console.log("logging out");
          setAuth({ loading: false, isAuthenticated: false, tokens: null });
          localStorage.removeItem("tokens");
          localStorage.removeItem("userType");
        }
      });
    } else {
      setAuth({ loading: false, isAuthenticated: false, tokens: null });
    }
  }, []);

  useEffect(() => {
    if (auth.tokens)
      localStorage.setItem("tokens", JSON.stringify(auth.tokens));
  }, [auth.tokens]);

  useEffect(() => {
    if (auth.userType)
      localStorage.setItem("userType", JSON.stringify(auth.userType));
  }, [auth.userType]);

  const getNewAccessToken = async () => {
    let accessToken = null;

    await axios
      .post(
        process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "auth/token/refresh/",
        {
          refresh: auth.tokens.refresh,
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        console.log("new access token extracted");
        setAuth({
          ...auth,
          tokens: {
            refresh: auth.tokens.refresh,
            access: res.data.access,
          },
        });

        accessToken = res.data.access;
      });

    return accessToken;
  };

  const validateRefreshToken = async (tokens) => {
    let isValid = null;

    await axios
      .post(
        process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "auth/token/verify/",
        {
          token: tokens.refresh,
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        console.log("refresh token is valid");
        isValid = true;
      })
      .catch((err) => {
        console.log(err);
        isValid = false;
      });

    return isValid;
  };

  const getAccessToken = async () => {
    let accessToken = null;
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "auth/token/verify/",
        {
          token: auth.tokens.access,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("access token is valid");
      accessToken = auth.tokens.access;
    } catch (error) {
      console.log("extracting new access token...");
      const newAccessToken = await getNewAccessToken(); // Await the promise

      // Only update accessToken if getNewAccessToken() output a new access token
      if (newAccessToken) {
        accessToken = newAccessToken;
      }
    }

    return accessToken;
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, getAccessToken }}>
      <h1>{auth.setAuth}</h1>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
