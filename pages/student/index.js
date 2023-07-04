import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Popup from "reactjs-popup";

import { AuthContext } from "../../contexts/Auth.Context";
import { ClassroomsContext } from "../../contexts/Classrooms.Context";

const contentStyle = { paddingLeft: "0.5rem", paddingRight: "0.5rem" };

const StudentHome = () => {
  const router = useRouter();
  const { auth, setAuth, getAccessToken } = useContext(AuthContext);
  const { classrooms, setClassrooms } = useContext(ClassroomsContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClassrooms, setFilteredClassrooms] = useState([]);

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
            setFilteredClassrooms(res.data);
          })
          .catch((res) => {
            console.log(res);
          });
      });
    }
  }, [auth.tokens]);

  const sortClassrooms = (classes) => {
    return classes.sort((a, b) =>
      a.status > b.status ? 1 : b.status > a.status ? -1 : 0
    );
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = classrooms.filter((classroom) => {
      return (
        classroom &&
        classroom.classroom &&
        classroom.classroom.name &&
        classroom.classroom.name.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredClassrooms(filtered);
  };

  const joinClass = ({ formCode, setFormError }) => {
    getAccessToken().then((accessToken) => {
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
        .catch((res) => {
          console.log(res);
          setFormError(true);
        });
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Student | EchoClass</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/mini_logo.ico" />
      </Head>

      <main className="pt-8 px-8 bg-white flex-grow">
        <div className="flex flex-row items-center mb-4">
          <h2 className="text-4xl font-bold">Courses</h2>
          <JoinClassForm {...{ joinClass }} />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by course name"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {filteredClassrooms.length === 0 ? (
            <p className="text-gray-500">No courses found ¯\_(ツ)_/¯</p>
          ) : (
            filteredClassrooms &&
            sortClassrooms(filteredClassrooms).map((cr, i) => {
              return <Classroom classroom={cr} key={i} />;
            })
          )}
        </div>
      </main>


    </div>
  );
};

export default StudentHome;

const Classroom = ({ classroom }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const cardClassName = `border rounded-lg p-4 shadow-md ${
    isHovered ? "shadow-lg" : ""
    }`;
  
  return (
    <Link href={"/student/class/" + classroom?.classroom?.code}>
      <div
        className={cardClassName}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-row items-center mb-2">
          <p className="text-lg font-semibold mr-4 overflow-hidden overflow-ellipsis">
            {classroom?.classroom?.name}
          </p>
          {classroom.status === 2 && (
            <p className="py-0.5 px-1 text-sm text-white bg-red-500 rounded">
              Archived
            </p>
          )}
        </div>

        <p className="text-gray-500">Code: {classroom?.classroom?.code}</p>
      </div>
    </Link>
  );
};

const JoinClassForm = ({ joinClass }) => {
  const [formCode, setFormCode] = useState("");
  const [formError, setFormError] = useState(false);
  const handleJoinClick = () => {
    if (!formCode) {
      setFormError(true);
    } else {
      joinClass({ formCode, setFormError });
    }
  };

  return (
    <Popup
      trigger={
        <button className="ml-6 mt-1 px-2 py-1 rounded-md text-white text-sm bg-gray-500 hover:bg-gray-600 cursor-pointer">
          Join Class
        </button>
      }
      position="bottom right"
    >
      {(close) => (
        <div className="px-4 py-4 bg-gray-100 max-w-min shadow-lg">
          <h2 className="text-lg mb-4 text-center">Join Classroom</h2>
          <label>
            <p className="font-semibold">Classroom Code</p>
            <input
              className="mt-2 outline-none border-2 rounded"
              type="text"
              name="class_name"
              autoComplete="off"
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
            />
          </label>
          <br />

          {formError && (
            <p className="text-sm text-red-500">
              Error joining classroom. Please try again.
            </p>
          )}
          <button
            className="mt-4 py-1 px-2 bg-red-500 hover:bg-red-600 text-white rounded"
            onClick={() => {
              handleJoinClick();
            }}
          >
            Join
          </button>
        </div>
      )}
    </Popup>
  );
};
