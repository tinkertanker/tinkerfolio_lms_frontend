import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { AuthContext } from "../../../contexts/Auth.Context";
import Dashboard from "../../../components/student/Dashboard";
import Leaderboard from "../../../components/student/Leaderboard";
import Announcements from "../../../components/student/Announcements";
import Resources from "../../../components/student/Resources";
import AnnouncementsPreview from "../../../components/student/AnnouncementsPreview";
import ResourcesPreview from "../../../components/student/ResourcesPreview";

import { ChevronBackOutline } from "react-ionicons";
import Popup from "reactjs-popup";

const Course = () => {
  const router = useRouter();
  const { auth, getAccessToken } = useContext(AuthContext);

  const [profile, setProfile] = useState();
  const [name, setName] = useState();
  const [classroom, setClassroom] = useState();
  const [tasks, setTasks] = useState();
  const [submissionStatuses, setSubmissionStatuses] = useState();
  const [submissions, setSubmissions] = useState();
  const [announcements, setAnnouncements] = useState();
  const [resources, setResources] = useState();
  const [leaderboard, setLeaderboard] = useState();

  const [showMain, setShowMain] = useState(true);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [showAllResources, setShowAllResources] = useState(false);
  const [sidebar, setSideBar] = useState(false);

  const [wsURL, setWSURL] = useState(null);
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(wsURL, {
    onOpen: () => console.log("opened"), // do not remove
    onMessage: (msg) => handleMessage(JSON.parse(msg.data)),
    shouldReconnect: (closeEvent) => true,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Connected",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Disconnected",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    const { code } = router.query;
    if (!code) return;

    if (auth.tokens) {
      setWSURL(
        process.env.NEXT_PUBLIC_BACKEND_WS_BASE +
          "/ws/student/?token=" +
          auth.tokens.access +
          "&code=" +
          code
      );
    } else return;

    // Get initial data
    getAccessToken().then((accessToken) => {
      axios
        .get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "/student/initial/", {
          headers: { Authorization: "Bearer " + accessToken },
          params: { code: code },
        })
        .then((res) => {
          setProfile(res.data.profile);
          setName(res.data.name);
          setClassroom(res.data.classroom);
          setTasks(res.data.tasks);
          setSubmissions(res.data.submissions);
          setSubmissionStatuses(res.data.submission_statuses);
          setAnnouncements(res.data.announcements);
          setResources(res.data.resources);
        });

      axios
        .get(
          process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "/student/leaderboard",
          {
            headers: { Authorization: "Bearer " + accessToken },
            params: { code: code },
          }
        )
        .then((res) => {
          setLeaderboard(res.data);
        });
    });
  }, []);

  //Update leaderboard and profile data every 30 seconds
  useEffect(() => {
    const { code } = router.query;
    const interval = setInterval(() => {
      getAccessToken().then((accessToken) => {
        axios
          .get(
            process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "/student/leaderboard",
            {
              headers: { Authorization: "Bearer " + accessToken },
              params: { code: code },
            }
          )
          .then((res) => {
            setLeaderboard((leaderboard) => res.data);
          });

        axios
          .get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "/student/initial/", {
            headers: { Authorization: "Bearer " + accessToken },
            params: { code: code },
          })
          .then((res) => {
            setProfile((profile) => res.data.profile);
          });
      });
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const reloadResource = (id, existingOneResource, existingResource, index) => {
    if (
      existingOneResource.file.slice(
        existingOneResource.file.indexOf("&Expires=") + 9
      ) > Math.floor(Date.now() / 1000)
    ) {
      window.open(existingOneResource.file);
    } else {
      getAccessToken().then((accessToken) => {
        axios
          .get(
            process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
              "/student/resource/" +
              id.toString() +
              "/",
            {
              headers: { Authorization: "Bearer " + accessToken },
              param: { code: code },
            }
          )
          .then((res) => {
            let indexRes =
              existingResource.resources.indexOf(existingOneResource);
            existingResource.resources = [
              ...existingResource.resources.slice(0, indexRes),
              res.data,
              ...existingResource.resources.slice(indexRes + 1),
            ];

            setResources([
              ...resources.filter(
                (r) =>
                  Object.keys(resources).find((key) => resources[key] === r) <
                  index
              ),
              existingResource,
              ...resources.filter(
                (r) =>
                  Object.keys(resources).find((key) => resources[key] === r) >
                  index
              ),
            ]);

            window.open(res.data.file);
          })
          .catch((res) => {
            console.log(res);
          });
      });
    }
  };

  const handleMessage = (msg) => {
    if (Object.keys(msg)[0] === "task") {
      setTasks([...tasks.filter((t) => t.id !== msg.task.id), msg.task]);
    } else if (Object.keys(msg)[0] === "submission") {
      setSubmissions([
        ...submissions.filter((sub) => sub.id !== msg.submission.id),
        msg.submission,
      ]);
    } else if (Object.keys(msg)[0] === "announcement") {
      setAnnouncements([
        ...announcements.filter((sub) => sub.id !== msg.announcement.id),
        msg.announcement,
      ]);
    }
  };

  const statusColor = {
    Connecting: "text-yellow-600",
    Connected: "text-green-600",
    Disconnected: "text-red-600",
  };
  const statusHexColor = {
    Connecting: "#D97706",
    Connected: "#059669",
    Disconnected: "#DC2626",
  };

  const changePage = (currentPage) => {
    if (showMain) setShowMain(false);
    if (showAllAnnouncements) setShowAllAnnouncements(false);
    if (showAllResources) setShowAllResources(false);

    switch (currentPage) {
      case "Main":
        setShowMain(true);
        break;
      case "Announcements":
        setShowAllAnnouncements(true);
        break;
      case "Resources":
        setShowAllResources(true);
        break;
    }
  };

  const toggleSidebar = () => setSideBar(!sidebar);

  return (
    <div>
      <Head>
        <title>Student | EchoClass</title>
        <style>{`\
                        .blinking {\
                            animation:blinkingText 3s infinite;\
                        }\
                        @keyframes blinkingText{\
                            0% {color: ${statusHexColor[connectionStatus]}}\
                            49% {color: ${statusHexColor[connectionStatus]}}\
                            70% {color: transparent}\
                            99% {color:transparent}\
                            100% {color: ${statusHexColor[connectionStatus]}}\
                        }\
                    `}</style>
      </Head>

      {showMain ? (
        <main className="h-full max-w-screen min-w-screen relative lg:flex lg:gap-6">
          <div className="bg-gray-200 h-full min-h-768px lg:h-screen w-screen lg:flex">
            <div
              className={`${
                !sidebar ? "hidden" : ""
              } z-20 h-full w-full bg-black fixed opacity-50`}
            ></div>
            <Sidebar
              {...{ changePage, toggleSidebar, profile, classroom, sidebar }}
            />
            <div className="lg:hidden min-w-full w-full p-4 z-10 bg-white shadow-lg flex items-center justify-between sticky top-0">
              <div className="flex items-center gap-3">
                <button
                  className="focus:outline-none font-bold text-2xl mx-2 cursor-pointer text-gray-600"
                  onClick={() => toggleSidebar()}
                >
                  <img src="../../hamburger_menu_icon.svg" width="30px" />
                </button>
                <div
                  className={`hidden flex flex-row items-center py-1 px-4  ${statusColor[connectionStatus]}`}
                >
                  <p className="blinking pr-2">⬤</p>
                  <p>{connectionStatus}</p>
                </div>
              </div>
            </div>
            <div></div>

            <div className="w-1/12 pr-2 pl-4 lg:flex flex-col justify-between hidden">
              <div className="h-1/2">
                <div className="h-2/3 py-3 flex flex-col items-center sticky top-0">
                  <AnnouncementsNav {...{ changePage }} />
                  <ResourcesNav {...{ changePage }} />
                </div>
              </div>

              <div className="h-1/6 py-3 flex items-center justify-center">
                <Profile {...{ profile, classroom, name }} />
              </div>
            </div>

            <div className="lg:w-7/12 px-2">
              <div className="lg:h-1/6 pb-3 pt-5 ">
                <Leaderboard {...{ profile, leaderboard, classroom }} />
              </div>
              <div className="h-5/6 py-3 overflow-hidden">
                <Dashboard
                  {...{
                    classroom,
                    tasks,
                    submissions,
                    setSubmissions,
                    submissionStatuses,
                    setSubmissionStatuses,
                    sendJsonMessage,
                  }}
                />
              </div>
            </div>
            <div className="lg:w-4/12 pl-2 pr-4">
              <div className="lg:h-1/3 pb-3 pt-5">
                <div className="bg-white h-full rounded-2xl px-3 sm:px-5 py-6 xl:p-4 shadow-lg">
                  <AnnouncementsPreview
                    announcements={announcements}
                    changePage={changePage}
                  />
                </div>
              </div>
              <div className="lg:h-2/3 py-3">
                <div className="bg-white h-full rounded-2xl px-3 sm:px-5 py-6 xl:p-4 shadow-lg">
                  <ResourcesPreview
                    resources={resources}
                    reloadResource={reloadResource}
                  />
                  <div className="relative flex justify-end bottom-0 mt-3">
                    <button
                      className="text-sm font-medium text-blue-600 hover:underline focus:outline-none"
                      onClick={() => changePage("Resources")}
                    >
                      View All Resources ({resources?.length})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <></>
      )}
      {showAllAnnouncements ? (
        <div className="mx-5 pt-12 pb-10 min-h-screen max-w-screen min-w-screen">
          <div className="flex items-center justify-between mb-6 sm:mx-20">
            <h1 className="text-2xl sm:text-4xl font-semibold">
              Announcements
            </h1>
            <button
              className="focus:outline-none ml-2 px-1 sm:px-3 py-1 w-min bg-blue-500 text-white rounded hover:bg-blue-600 font-bold flex items-center justify-center"
              onClick={() => changePage("Main")}
            >
              <ChevronBackOutline
                color={"#00000"}
                title={"Back"}
                height="28px"
                width="28px"
              />
              <p className="text-sm sm:text-base mx-2">Back</p>
            </button>
          </div>
          <Announcements announcements={announcements} />
        </div>
      ) : (
        <></>
      )}
      {showAllResources ? (
        <div className="mx-5 pt-12 pb-10 min-h-screen max-w-screen min-w-screen">
          <div className="flex items-center justify-between mb-6 sm:mx-20">
            <h1 className="text-2xl sm:text-4xl font-semibold">Resources</h1>
            <button
              className="focus:outline-none px-1 sm:px-3 py-1 w-min bg-blue-500 text-white rounded hover:bg-blue-600 font-bold flex items-center justify-center"
              onClick={() => changePage("Main")}
            >
              <ChevronBackOutline
                color={"#00000"}
                title={"Back"}
                height="28px"
                width="28px"
              />
              <p className="text-base mx-2">Back</p>
            </button>
          </div>
          <Resources resources={resources} reloadResource={reloadResource} />
        </div>
      ) : (
        <></>
      )}
      <footer></footer>
      <div
        className={`fixed bottom-4 right-4 lg:flex flex-row items-center py-1 px-4 rounded-full bg-white shadow-xl hidden ${statusColor[connectionStatus]}`}
      >
        <p className="blinking pr-2">⬤</p>
        <p>{connectionStatus}</p>
      </div>
    </div>
  );
};

export default Course;

const Profile = ({ name, profile, classroom }) => {
  const { auth, setAuth } = useContext(AuthContext);
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

  if (!profile) return null;
  if (!classroom) return null;

  return (
    <Popup
      trigger={
        <div className="bg-white rounded-2xl shadow-lg hover:bg-gray-100 cursor-pointer p-4">
          <img src="../../profile_icon.svg" width="40px" />
        </div>
      }
      position="right bottom"
      arrow={false}
    >
      <div className="bg-white w-56 ml-6 p-5 shadow-xl rounded-2xl ">
        <p className="font-semibold text-lg mb-2 truncate">
          {name ? name : <span className="italic">(Unnamed)</span>}
        </p>

        <div className="flex justify-between items-center mb-2">
          <p className="font-medium text-white bg-gray-500 px-3 py-1 rounded-lg text-sm">
            Class Code:
          </p>
          <p className="font-medium">{classroom.code}</p>
        </div>
        <div className="border-t border-gray-400"></div>
        <button className="mt-2 py-2 w-full outline-none focus:outline-none hover:bg-gray-200 cursor-pointer rounded-lg ">
          <div onClick={logout} className="flex items-center px-2">
            <img src="../../logout_icon.svg" width="20px" />
            <p className="font-semibold ml-3 text-red-500">Log Out</p>
          </div>
        </button>
      </div>
    </Popup>
  );
};

const AnnouncementsNav = ({ changePage }) => {
  return (
    <Popup
      trigger={
        <div
          onClick={() => changePage("Announcements")}
          className="bg-white rounded-t-2xl hover:bg-gray-100 cursor-pointer px-4 py-6"
        >
          <img src="../../megaphone_icon.svg" width="40px" />
        </div>
      }
      position="right"
      on={["hover", "focus"]}
      arrow={false}
    >
      <div className="bg-gray-600 ml-4 px-3 py-2 rounded-lg shadow-xl">
        <p className="font-semibold text-white">Announcements</p>
      </div>
    </Popup>
  );
};

const ResourcesNav = ({ changePage }) => {
  return (
    <Popup
      trigger={
        <div
          onClick={() => changePage("Resources")}
          className="bg-white rounded-b-2xl hover:bg-gray-100 cursor-pointer px-4 py-6 shadow-lg"
        >
          <img src="../../folder_icon.svg" width="40px" />
        </div>
      }
      position="right"
      on={["hover", "focus"]}
      arrow={false}
    >
      <div className="bg-gray-600 ml-4 px-3 py-2 rounded-lg shadow-xl">
        <p className="font-semibold text-white">Resources</p>
      </div>
    </Popup>
  );
};

const Sidebar = ({
  changePage,
  toggleSidebar,
  profile,
  classroom,
  sidebar,
}) => {
  const { auth, setAuth } = useContext(AuthContext);
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

  if (!profile || !classroom) return null;

  return (
    <div
      className={`${
        !sidebar ? "hidden" : ""
      } z-30 h-full w-3/5 md:w-2/5 bg-white fixed p-5`}
    >
      <button
        onClick={() => toggleSidebar()}
        className="focus:outline-none font-bold text-2xl mx-2 cursor-pointer text-gray-600"
      >
        ✕
      </button>

      <div className="my-5 py-2">
        <div>
          <p className="font-bold text-2xl truncate mb-3">
            {profile.name ? (
              profile.name
            ) : (
              <span className="italic">(Unnamed)</span>
            )}
          </p>

          <div className="flex justify-between items-center">
            <p className="font-medium text-white bg-gray-500 px-3 py-1 rounded-lg text-sm">
              Class Code:
            </p>
            <p className="font-medium">{classroom.code}</p>
          </div>
          <div className="border-t border-gray-400 my-6"></div>

          <button
            onClick={() => changePage("Announcements")}
            className="py-3 px-1 w-full outline-none focus:outline-none hover:bg-gray-200 cursor-pointer rounded-lg "
          >
            <div className="flex items-center px-2">
              <img src="../../megaphone_icon.svg" width="20px" />
              <p className="font-semibold ml-3">Announcements</p>
            </div>
          </button>

          <button
            onClick={() => changePage("Resources")}
            className="py-3 px-1 w-full outline-none focus:outline-none hover:bg-gray-200 cursor-pointer rounded-lg "
          >
            <div className="flex items-center px-2">
              <img src="/folder_icon.svg" width="20px" />
              <p className="font-semibold ml-3">Resources</p>
            </div>
          </button>
        </div>
        <div>
          <button
            onClick={logout}
            className="py-3 px-1 w-full outline-none focus:outline-none hover:bg-gray-200 cursor-pointer rounded-lg "
          >
            <div className="flex items-center px-2">
              <img src="../../logout_icon.svg" width="20px" />
              <p className="font-semibold ml-3 text-red-500">Log Out</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
