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
        router.push("/student/test");
      } else {
        router.push("/login");
      }
    }
  }, [auth]);
  return (
    <div>
      <Head>
        <title>Login | EchoClass</title>
      </Head>

      <main className="flex flex-col items-center pt-8 px-8 bg-white">
        {invalidInput && (
          <p className="py-2 px-2 border-2 border-red-500 rounded-lg font-bold text-red-500">
            Invalid inputs.
          </p>
        )}

        <h1 className="text-5xl my-6 font-bold">Login</h1>

        <form onSubmit={(e) => loginUser(e)}>
          <label>
            <h2 className="font-semibold text-lg pb-2">Username</h2>
            <input
              className="outline-none border-b-2 text-xl w-full"
              type="text"
              placeholder="Enter Username"
              name="code"
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
          </label>
          <label>
            <h2 className="font-semibold text-lg pb-2 mt-4">Password</h2>
            <input
              className="outline-none border-b-2 text-xl"
              type="password"
              placeholder="Enter Password"
              name="index"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
          </label>
          <br />
          <div className="mb-4 mt-4">
            <label className="mr-4">
              <input
                type="radio"
                value="teacher"
                checked={userType === "teacher"}
                onChange={() => handleUserTypeSelect("teacher")}
              />{" "}
              Teacher
            </label>
            <label>
              <input
                type="radio"
                value="student"
                checked={userType === "student"}
                onChange={() => handleUserTypeSelect("student")}
              />{" "}
              Student
            </label>
          </div>
          {loginFailed && (
            <small className="text-red-500 mt-2">
              Invalid username or password.
            </small>
          )}
          {auth.loading ? (
            <div
              className="flex flex-row justify-center bg-blue-500 mt-4 py-1 px-2 rounded-md w-full"
              style={{ height: "36px" }}
            >
              <SyncLoader color={"#ffffff"} size={8} margin={1} />
            </div>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg mt-4 py-1 px-2 rounded-md w-full"
            >
              Login
            </button>
          )}
        </form>
      </main>

      <footer></footer>
    </div>
  );
};

export default Login;
