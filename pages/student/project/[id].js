import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Link from "next/link";


import { AuthContext } from "../../../contexts/Auth.Context";

const contentStyle = { paddingLeft: "0.5rem", paddingRight: "0.5rem" };

const Project = () => {
  const router = useRouter();
  const { auth, setAuth, getAccessToken } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submission, setSubmission] = useState([]);

  useEffect(() => {
    // Get project
    if (auth.tokens) {
      getAccessToken().then((accessToken) => {
        axios
          .get(
            process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
              "student/submission/" +
              router.query.id +
              "/",
            {
              headers: { Authorization: "Bearer " + accessToken },
            }
          )
          .then((res) => {
            setSubmission(res.data);
          })
          .catch((res) => {
            console.log(res);
          });
      });
    }
  }, [auth.tokens]);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-metallic min-h-screen flex flex-col">
      <div className="w-full max-w-10xl p-6">
        <div className="flex items-center mb-4">
          <Link legacyBehavior href="/student/profile">
            <a className="flex items-center text-gray-500 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </a>
          </Link>
        </div>
        {submission ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-semibold mb-4">
              {submission.task_name}
            </h1>
            <p className="text-gray-600 mb-4">
              Course: {submission.classroom_name}
            </p>
            {submission.comments && (
              <p className="text-gray-600 mb-4">
                Reviews: {submission.comments}
              </p>
            )}

            {submission.text && (
              <p className="text-gray-600 mb-4 break-words">
                Text: {submission.text}
              </p>
            )}

            {submission.image && (
              <div className="relative">
                <img
                  src={submission.image}
                  alt="Submission Image"
                  className="mb-4 rounded cursor-pointer max-w-full h-auto"
                  style={{ maxWidth: "500px", maxHeight: "500px" }}
                  onClick={handleImageClick}
                />
                {isModalOpen && (
                  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75">
                    <div className="max-w-3xl">
                      <img
                        src={submission.image}
                        alt="Full-size Image"
                        className="rounded"
                      />
                      <button
                        className="absolute top-0 right-0 p-2 text-white"
                        onClick={handleCloseModal}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p>Loading submission...</p>
        )}
      </div>
    </div>
  );
};

export default Project;
