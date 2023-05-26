import { useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../contexts/Auth.Context";

const OPENROUTES = ["/join", "/login", "/", "/register", "/student/test"];

const PrivateRoute = ({ children }) => {
  if (typeof window === "undefined") return children;

  const router = useRouter();
  const { auth } = useContext(AuthContext);

  // if (auth.loading === true) return (<h1>Loading...</h1>)
  if (!auth.isAuthenticated && !OPENROUTES.includes(router.pathname))
    router.push("/");

  if (auth.isAuthenticated && router.pathname == "/") {
    if (auth.userType === "teacher") {
      router.push("/teacher");
    } else {
      router.push("/student/");
    }
  }

  return children;
};

export default PrivateRoute;
