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
     return (
       <div className="flex flex-col items-center justify-center h-screen bg-white">
         <img src="main_logo_1.png" alt="Tinkertanker Logo" className="w-20 mb-4" />
         <div className="flex items-center justify-center">
           <svg
             className="animate-spin h-10 w-10 mr-3 text-red-500"
             viewBox="0 0 24 24"
           >
             <circle
               className="opacity-25"
               cx="12"
               cy="12"
               r="10"
               stroke="currentColor"
               strokeWidth="4"
             />
             <path
               className="opacity-75"
               fill="currentColor"
               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004.061 17H4a8 8 0 000-16h.061A7.963 7.963 0 0012 4.061V7l4-4v12l-8-8z"
             />
           </svg>
           <p className="text-gray-500">Loading...</p>
         </div>
       </div>
     );
  }

  return children;
};

export default PrivateRoute;
