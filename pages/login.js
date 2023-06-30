import Head from "next/head";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SyncLoader from "react-spinners/SyncLoader";

import { AuthContext } from "../contexts/Auth.Context";

const Login = () => {
  const router = useRouter();

  const { auth, setAuth } = useContext(AuthContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loginFailed, setLoginFailed] = useState();
  const [userType, setUserType] = useState("");

  const [invalidInput, setInvalidInput] = useState(false);

  const loginUser = (e) => {
    e.preventDefault();
    setAuth({ ...auth, loading: true });

    console.log("ran");
    axios
      .post(
        process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "auth/token/",
        {
          username,
          password,
          userType,
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        setAuth({
          loading: false,
          isAuthenticated: true,
          tokens: res.data,
          userType: userType,
        });
      })
      .catch((res) => {
        console.log("login failed");
        console.log(res);
        setAuth({ ...auth, loading: false });
        setLoginFailed(true);
      });
  };

  const handleUserTypeSelect = (selectedUserType) => {
    setUserType(selectedUserType);
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      if (auth.userType === "teacher") {
        router.push("/teacher/");
      } else if (auth.userType === "student") {
        router.push("/student/");
      } else {
        router.push("/login");
      }
    }
  }, [auth]);
  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Login | EchoClass</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css"
        />
      </Head>

      <main className="flex flex-col items-center pt-8 px-8">
        {invalidInput && (
          <p className="py-2 px-2 border-2 border-red-500 rounded-lg font-bold text-red-500">
            Invalid inputs.
          </p>
        )}

        <h1 className="text-5xl my-6 font-bold">Login</h1>

        <form onSubmit={(e) => loginUser(e)} className="max-w-sm w-full">
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="username">
              Username
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              type="text"
              id="username"
              placeholder="Enter username"
              name="code"
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              type="password"
              id="password"
              placeholder="Enter password"
              name="index"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="text-lg font-semibold">Register as</label>
            <div className="flex items-center mt-2">
              <label className="mr-4">
                <input
                  type="radio"
                  value="teacher"
                  checked={userType === "teacher"}
                  onChange={() => handleUserTypeSelect("teacher")}
                  className="mr-2"
                />
                Teacher
              </label>
              <label>
                <input
                  type="radio"
                  value="student"
                  checked={userType === "student"}
                  onChange={() => handleUserTypeSelect("student")}
                  className="mr-2"
                />
                Student
              </label>
            </div>
          </div>
          {loginFailed && (
            <small className="text-red-500 mt-2">
              Invalid username or password.
            </small>
          )}
          {auth.loading ? (
            <div className="flex flex-row justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white text-lg py-2 px-4 rounded-lg w-full"
            >
              Login
            </button>
          )}
        </form>
      </main>
    </div>
  );


};

export default Login;
