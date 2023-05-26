import Head from "next/head";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SyncLoader from "react-spinners/SyncLoader";
import { AuthContext } from "../contexts/Auth.Context";

const Register = () => {
  const router = useRouter();

  const { auth, setAuth } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registrationFailed, setRegistrationFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userType, setUserType] = useState("");

  const registerUser = (e) => {
    e.preventDefault();
    setIsLoading(true);

    //   TODO: Create endpoint /auth/register/ in backend
    axios
      .post(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "auth/register/", {
        username,
        password,
        userType,
      })
      .then((res) => {
        setIsLoading(false);
        setAuth({
          loading: false,
          isAuthenticated: true,
          tokens: res.data,
          userType, 
        });

        if (auth.userType === "teacher") {
          router.push("/teacher/");
        } else if (auth.userType === "student") {
          router.push("/student/test");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setRegistrationFailed(true);
        console.log("registration failed", error);
      });
  };

  return (
    <div>
      <Head>
        <title>Registration | EchoClass</title>
      </Head>

      <main className="flex flex-col items-center pt-8 px-8 bg-white">
        <h1 className="text-5xl my-6 font-bold">Registration</h1>

        <form onSubmit={registerUser}>
          <label>
            <h2 className="font-semibold text-lg pb-2">Username</h2>
            <input
              className="outline-none border-b-2 text-xl w-full"
              type="text"
              placeholder="Enter Username"
              name="username"
              value={username}
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
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
          </label>
          <br />
          <label>
            <h2 className="font-semibold text-lg pb-2 mt-4">User Type</h2>
            <select
              className="outline-none border-b-2 text-xl"
              name="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </label>
          <br />
          {registrationFailed && (
            <small className="text-red-500 mt-2">
              Registration failed. Please try again.
            </small>
          )}
          {isLoading ? (
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
              Register
            </button>
          )}
        </form>
      </main>

      <footer></footer>
    </div>
  );
};

export default Register;
