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
  const [formError, setFormError] = useState("");
  const [successfulLogin, setSuccessfulLogin] = useState(false);
  const [userType, setUserType] = useState("");

  const registerUser = (e) => {
    e.preventDefault();

    if (username.length > 150 || firstName.length > 150) {
      setFormError("Name and username should be less than 150 characters.");
      return;
    }

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
          if (
            error.response &&
            error.response.data.error === "Username already exists."
          ) {
            setFormError("Username taken. Choose another username.");
          } else if (
            error.response &&
            error.response.data.error === "Email already exists."
          ) {
            setFormError("Email taken. Choose another email.");
          } else {
            setFormError("Registration failed. Please try again.");
          }
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
          if (
            error.response &&
            error.response.data.error === "Duplicate student"
          ) {
            setFormError("Username taken. Choose another username.");
          } else {
            setFormError("Registration failed. Please try again.");
          }
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setFormError("Unsuccessful registration. Please try again.");
    }
  };

  useEffect(() => {
    if (successfulLogin) router.push("/login");
  }, [successfulLogin]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Registration | EchoClass</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css"
        />
      </Head>

      <main className="flex flex-col items-center pt-8 px-8">
        <h1 className="text-5xl my-6 font-bold">Register</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            registerUser(e);
          }}
          className="max-w-sm w-full"
        >
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="username">
              Username
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              type="text"
              id="username"
              placeholder="Enter username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
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
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="firstName">
              Name
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              type="text"
              id="firstName"
              placeholder="Enter name"
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              type="email"
              id="email"
              placeholder="Enter email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
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
                  onChange={() => setUserType("teacher")}
                  className="mr-2"
                  name="userType"
                  required
                />
                Teacher
              </label>
              <label>
                <input
                  type="radio"
                  value="student"
                  checked={userType === "student"}
                  onChange={() => setUserType("student")}
                  className="mr-2"
                  name="userType"
                  required
                />
                Student
              </label>
            </div>
          </div>

          {!loginDetails && formError && (
            <div className="flex items-center justify-center">
              <small className="text-red-500 mt-2">{formError}</small>
            </div>
          )}
          {isLoading ? (
            <div className="flex flex-row justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white text-lg py-2 px-4 rounded-lg w-full"
            >
              Register
            </button>
          )}
        </form>
      </main>
    </div>
  );
};

export default Register;
