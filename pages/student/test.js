import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Popup from "reactjs-popup";

import { AuthContext } from "../../contexts/Auth.Context";
import { ClassroomsContext } from "../../contexts/Classrooms.Context";

const contentStyle = { paddingLeft: "0.5rem", paddingRight: "0.5rem" };

const StudentTest = () => {
  const { auth, setAuth, getAccessToken } = useContext(AuthContext);
  const { classrooms, setClassrooms } = useContext(ClassroomsContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Get classrooms
    if (auth.tokens) {
      getAccessToken().then((accessToken) => {
        axios
          .get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "student/enroll/", {
            headers: { Authorization: "Bearer " + accessToken },
          })
          .then((res) => {
            setClassrooms(res.data);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
            setError(true);
          });
      });
    }
  }, [auth.tokens]);

  const sortClassrooms = (classes) => {
    return classes.sort((a, b) =>
      a.status > b.status ? 1 : b.status > a.status ? -1 : 0
    );
  };

  const joinClass = ({ formCode }) => {
    getAccessToken().then((accessToken) => {
      console.log("formCode: " + formCode);
      axios
        .post(
          process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "student/enroll/",
          {
            code: formCode,
          },
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        )
        .then((res) => {
          let classroom = res.data;
          setClassrooms([...classrooms, classroom]);
        })
        .catch((error) => {
          console.log("Error: " + error);
        });
    });
  };

  return (
    <div>
      {/* ... */}
      {loading && <p>Loading...</p>}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4">
          <p className="text-sm">{`Error fetching classrooms. Please try again later.`}</p>
        </div>
      )}
      {/* ... */}
    </div>
  );
};

export default StudentTest;
