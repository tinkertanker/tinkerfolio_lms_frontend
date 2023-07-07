import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../contexts/Auth.Context";

const OPENROUTES = ["/join", "/login", "/", "/register"];

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const { auth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.loading) {
      setIsLoading(false);
      if (!auth.isAuthenticated && !OPENROUTES.includes(router.pathname))
        router.push("/");
      if (auth.isAuthenticated && router.pathname === "/") {
        if (auth.userType === "teacher") {
          router.push("/teacher");
        } else {
          router.push("/student");
        }
      }
    }
  }, [auth.loading, auth.isAuthenticated, auth.userType, router.pathname]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return children;
};

export default PrivateRoute;
