import Head from "next/head";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SyncLoader from "react-spinners/SyncLoader";
import { AuthContext } from "../contexts/Auth.Context";
import { useEffect } from "react";

const Register = () => {
  const router = useRouter();

  const { auth, setAuth } = useContext(AuthContext);
  const [loginDetails, setLoginDetails] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(false);
  const [successfulLogin, setSuccessfulLogin] = useState(false);
  const [userType, setUserType] = useState("");

  const registerUser = (e) => {
    e.preventDefault();

    if (userType === "student") {
      axios
        .post(
          process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
            "auth/token/student_signup/",
          {
            username,
            email,
            first_name: firstName,
            password,
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          setLoginDetails(res.data);
          setSuccessfulLogin(true);
          setIsLoading(false);
          setAuth({
            loading: false,
            isAuthenticated: false,
            tokens: res.data,
            userType: "student",
          });
          setUserType("student");
        })
        .catch((error) => {
          console.log("failed");
          setIsLoading(false);
        });
    } else if (userType === "teacher") {
      axios
        .post(
          process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
            "auth/token/teacher_signup/",
          {
            username,
            email,
            first_name: firstName,
            password,
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          setLoginDetails(res.data);
          setIsLoading(false);
          setSuccessfulLogin(true);
          setAuth({
            loading: false,
            isAuthenticated: false,
            tokens: res.data,
            userType: "teacher",
          });
          setUserType("teacher");
        })
        .catch((error) => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setFormError(true);
    }
  };

  useEffect(() => {
    if (successfulLogin) router.push("/login");
  }, [successfulLogin]);

  return (
    <div>
      <Head>
        <title>Registration | EchoClass</title>
      </Head>

      <main className="flex flex-col items-center pt-8 px-8 bg-white">
        <h1 className="text-5xl my-6 font-bold">Registration</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            registerUser(e);
          }}
          className=""
        >
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
            <h2 className="font-semibold text-lg pb-2 mt-4">Name</h2>
            <input
              className="outline-none border-b-2 text-xl"
              type="text"
              placeholder="Enter first name"
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="off"
            />
          </label>
          <br />

    

          <label>
            <h2 className="font-semibold text-lg pb-2 mt-4">Email</h2>
            <input
              className="outline-none border-b-2 text-xl"
              type="email"
              placeholder="Enter email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
          </label>
          <br />

          <div className="mt-4">
            <h2 className="font-semibold text-lg pb-2 mt-4">Register as</h2>
            <label className="mr-4">
              <input
                type="radio"
                value="teacher"
                checked={userType === "teacher"}
                onChange={() => setUserType("teacher")}
              />{" "}
              Teacher
            </label>
            <label>
              <input
                type="radio"
                value="student"
                checked={userType === "student"}
                onChange={() => setUserType("student")}
              />{" "}
              Student
            </label>
          </div>

          <br />
          {!loginDetails && formError && (
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
