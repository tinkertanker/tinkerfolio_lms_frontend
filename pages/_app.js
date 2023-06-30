import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useContext, useState } from "react";
import "../styles/globals.css";
import AuthContextProvider from "../contexts/Auth.Context";
import ClassroomsContextProvider, {
  ClassroomsContext,
} from "../contexts/Classrooms.Context";
import PrivateRoute from "../utils/PrivateRoute";

import { AuthContext } from "../contexts/Auth.Context";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <PrivateRoute>
        <ClassroomsContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ClassroomsContextProvider>
      </PrivateRoute>
    </AuthContextProvider>
  );
}

export default MyApp;

const Layout = ({ children }) => {
  const router = useRouter();
  const { auth, setAuth } = useContext(AuthContext);
  const { classroom, setClassroom } = useContext(ClassroomsContext);

  const logout = () => {
    setAuth({ ...auth, loading: true });
    setAuth({
      loading: false,
      isAuthenticated: false,
      tokens: null,
      userType: null,
    });
    localStorage.removeItem("tokens");
    localStorage.removeItem("userType");
  };

  const profile = () => {
    router.push("/student/profile");
  };

  let navStyle = "bg-white border-b-2 px-8 py-2 flex flex-row items-center";
  if (router.pathname === "/")
    navStyle =
      "max-w-5xl 2xl:max-w-7xl mx-auto py-4 px-6 md:px-0 bg-gray-100 flex flex-row items-center";
  if (router.pathname === "/login")
    navStyle = "bg-white border-b-2 px-6 py-2 flex flex-row items-center";
  if (router.pathname === "/student/");
  if (router.pathname.includes("/teacher/"))
    navStyle = "fixed w-full bg-white px-8 py-2 flex flex-row items-center";
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Staatliches&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/mini_logo.ico" />

        <meta
          property="og:image"
          content="https://www.echoclass.com/main_logo_1.png"
        />

        <meta name="twitter:card" content="summary" key="twitter_card" />
        <meta
          name="twitter:site"
          content="@themichaelchen"
          key="twitter_site"
        />
        <meta
          name="twitter:image"
          content="https://www.echoclass.com/main_logo_1.png"
          key="twitter_image"
        />
      </Head>
      <div className="flex flex-col min-h-screen">
        <div
          className={router.pathname === "/" ? "bg-gray-100 " : "bg-gray-100 "}
        >
          <nav className={navStyle}>
            {["/", "/login", "/register"].includes(router.pathname) ? (
              <Link href="/">
                <img
                  className="cursor-pointer"
                  src="/main_logo_1.png"
                  height="150"
                  width="150"
                />
              </Link>
            ) : (
              <Link href="/">
                <img
                  className="cursor-pointer"
                  src="/main_logo_1.png"
                  height="150"
                  width="150"
                />
              </Link>
            )}

            {!auth.isAuthenticated && (
              <div className="flex flex-row-reverse items-center ml-auto gap-4 sm:gap-8">
                <Link
                  href="/login"
                  className="px-4 py-0.5 border-2 border-red-500 hover:border-red-700 text-red-500 hover:text-red-700 text-lg rounded-full font-semibold"
                >
                  Login
                </Link>
                <Link
                  className="text-gray-500 hover:text-gray-700"
                  href="/register"
                >
                  Register{" "}
                </Link>
              </div>
            )}

            {auth.isAuthenticated && (
              <div className="ml-auto">
                {auth.userType === "student" && (
                  <button
                    onClick={profile}
                    className="bg-white border-2 border-gray-300 text-sm text-gray-500 py-1 px-3 rounded-full hover:bg-gray-100 transition-colors duration-300"
                  >
                    Portfolio
                  </button>
                )}

                <button
                  onClick={logout}
                  className="bg-white border-2 border-gray-300 text-sm text-gray-500 py-1 px-3 ml-2 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
          {children}
          <footer
            className={
              router.pathname === "/register" || router.pathname === "/login" || router.pathname === "/"
                ? "bg-gray-100 py-12 mt-auto"
                : "bg-white py-12 mt-auto"
            }
          >
            <div className="container mx-auto px-4">
              <p className="text-center text-gray-400">
                &copy; Tinkertanker 2023
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};
