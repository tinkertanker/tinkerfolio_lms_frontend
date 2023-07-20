import { useState, useContext, useEffect } from "react";
import Popup from "reactjs-popup";
import CustomPopup from "../../utils/CustomPopup";
import CustomLinkify from "../../utils/CustomLinkify";
import axios from "axios";

import { AuthContext } from "../../contexts/Auth.Context";

import {
  ChevronBackOutline,
  ChevronForwardOutline,
  Funnel,
} from "react-ionicons";

const contentStyle = { overflowY: "scroll", margin: "10px auto" };

const Dashboard = ({
  classroom,
  tasks,
  submissions,
  setSubmissions,
  submissionStatuses,
  setSubmissionStatuses,
  sendJsonMessage,
  classMembers,
  name,
}) => {
  const { getAccessToken } = useContext(AuthContext);

  const addSubmission = (task, textInput, fileInput, id, team_students, setIsSubmitted, setIsGraded) => {
    if (!textInput && !fileInput) {
      alert(
        "Both text and image inputs are blank. Submission not created."
      );
      return;
    }
    if (task.is_group && (!team_students|| team_students.length === 0)) {
      alert("Select at least one member!");
      return;

    }
    const formData = new FormData();
    formData.append("task_id", id);
    formData.append("code", classroom);
    textInput && formData.append("text", textInput);
    fileInput && formData.append("image", fileInput);

    if (task.is_group) {
      console.log("submitting group")
      formData.append("team_students", team_students);
      console.log(team_students)
      getAccessToken().then((accessToken) => {
        axios
          .post(
            process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "student/group_submission/",
            formData,
            {
              headers: { Authorization: "Bearer " + accessToken },
            }
          )
          .then((res) => {
            setSubmissions([...submissions, res.data]);
            setIsSubmitted(true);
            setIsGraded([0, 1, 2, 3, 4, 5].includes(res.data.stars));
          })
          .catch((res) => {
            console.log(res);
          });
      });
    
    } else {
      getAccessToken().then((accessToken) => {
        console.log("submitting indiv");
        axios
          .post(
            process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "student/submission/",
            formData,
            {
              headers: { Authorization: "Bearer " + accessToken },
            }
          )
          .then((res) => {
            setSubmissions([...submissions, res.data]);
            setIsSubmitted(true);
            setIsGraded([0, 1, 2, 3, 4, 5].includes(res.data.stars));
          })
          .catch((res) => {
            console.log(res);
          });
      });
    };
  };

  const updateSubmission = (textInput, fileInput, id, task_id) => {
    try {
      const existingSubmission = submissions.filter(
        (subSubmission) => subSubmission.id === id
      );

      const formData = new FormData();
      formData.append("task_id", task_id);
      formData.append("code", classroom);
      textInput && formData.append("text", textInput);
      fileInput && formData.append("image", fileInput);

      getAccessToken().then((accessToken) => {
        axios
          .put(
            process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
              "student/submission/" +
              existingSubmission[0].id +
              "/",
            formData,
            {
              headers: { Authorization: "Bearer " + accessToken },
            }
          )
          .then((res) => {
            setSubmissions([
              ...submissions.filter((subSubmission) => subSubmission.id !== id),
              res.data,
            ]);
          })
          .catch((res) => {
            console.log("err:", res);
          });
      });
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  const updateStatus = ({ taskID, status, task, selectedStudents }) => {
    const existingStatus = submissionStatuses.filter(
      (substatus) => substatus.task === taskID
    );

    if (task.is_group) {
      if (existingStatus.length === 1) {
        // group only can submit
        return;
      } else {
        getAccessToken().then((accessToken) => {
          axios
            .post(
              process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
                "student/group_submission_status/",
              {
                team_students: selectedStudents,
                task_id: taskID,
                status,
              },
              {
                headers: { Authorization: "Bearer " + accessToken },
              }
            )
            .then((res) => {
              setSubmissionStatuses([
                ...submissionStatuses.filter(
                  (substatus) => substatus.task !== taskID
                ),
                res.data,
              ]);
            })
            .catch((res) => {
              console.log(res);
            });
        });
      }
    } else {
      // individual task
      if (existingStatus.length === 1) {
        // status already exists
        getAccessToken().then((accessToken) => {
          axios
            .put(
              process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
                "student/submission_status/" +
                existingStatus[0].id +
                "/",
              { status },
              {
                headers: { Authorization: "Bearer " + accessToken },
              }
            )
            .then((res) => {
              setSubmissionStatuses([
                ...submissionStatuses.filter(
                  (substatus) => substatus.task !== taskID
                ),
                res.data,
              ]);
            })
            .catch((res) => {
              console.log(res);
            });
        });
      } else {
        // status does not exist yet
        getAccessToken().then((accessToken) => {
          axios
            .post(
              process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
                "student/submission_status/",
              {
                task_id: taskID,
                status,
              },
              {
                headers: { Authorization: "Bearer " + accessToken },
              }
            )
            .then((res) => {
              setSubmissionStatuses([
                ...submissionStatuses.filter(
                  (substatus) => substatus.task !== taskID
                ),
                res.data,
              ]);
            })
            .catch((res) => {
              console.log(res);
            });
        });
      }
    }
  };

  const reloadSubmission = (id) => {
    // When image URL expires
    getAccessToken().then((accessToken) => {
      axios
        .get(
          process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
            "student/submission/" +
            id.toString() +
            "/",
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        )
        .then((res) => {
          setSubmissions([
            ...submissions.filter((s) => s.id !== res.data.id),
            res.data,
          ]);
        })
        .catch((res) => {
          console.log(res);
        });
    });
  };

  if (!tasks || !submissions || !submissionStatuses) return <h1></h1>;

  const sortedTasks = (tasks) => {
    const getIncomplete = (task) =>
      !submissions.filter((s) => s.task === task.id)[0];
    const getComplete = (task) =>
      submissions.filter((s) => s.task === task.id)[0];
    const getNotGraded = (task) =>
      getComplete(task) &&
      ![0, 1, 2, 3, 4, 5].includes(getComplete(task).stars);
    const getGraded = (task) =>
      getComplete(task) && [0, 1, 2, 3, 4, 5].includes(getComplete(task).stars);

    var taskToList = [];

    if (filterStudentTasks.includes("incomplete")) {
      const taskList = tasks.filter((task) => getIncomplete(task));
      taskToList = taskToList.concat(taskList);
    }
    if (filterStudentTasks.includes("completed & ungraded")) {
      const taskList = tasks.filter(
        (task) => getComplete(task) && getNotGraded(task)
      );
      taskToList = taskToList.concat(taskList);
    }
    if (filterStudentTasks.includes("completed & graded")) {
      const taskList = tasks.filter(
        (task) => getComplete(task) && getGraded(task)
      );
      taskToList = taskToList.concat(taskList);
    }
    const getPriority = (id) => {
      const sub = submissions.filter((s) => s.task === id)[0];
      const isSubmitted = sub ? true : false;
      const isGraded = sub
        ? [0, 1, 2, 3, 4, 5].includes(sub.stars)
          ? true
          : false
        : false;
      

      if (!isSubmitted) return 2;
      if (isSubmitted && isGraded) return 1;
      return 0;
    };
    return taskToList.sort((a, b) =>
      getPriority(a.id) < getPriority(b.id) ? 1 : -1
    );
  };

  const [currentTaskPage, setCurrentTasksPage] = useState(1);
  const [isOnEndTaskPage, setIsOnEndTaskPage] = useState(false);
  const [isOnStartTaskPage, setIsOnStartTaskPage] = useState(true);
  const [showArchivedTasks, setShowArchivedTasks] = useState(false);
  const [filterStudentTasks, setFilterStudentTasks] = useState([
    "incomplete",
    "completed & ungraded",
    "completed & graded",
  ]);

  const numberOfActiveTasks = sortedTasks(
    tasks.filter((t) => t.status === 1)
  ).length;
  const numberOfArchivedTasks = tasks.filter((t) => t.status !== 1).length;

  useEffect(() => {
    const maxTasks = showArchivedTasks
      ? numberOfArchivedTasks
      : numberOfActiveTasks;

    if (currentTaskPage >= Math.ceil(maxTasks / 5)) {
      setIsOnEndTaskPage(true);
    } else {
      setIsOnEndTaskPage(false);
    }
    if (currentTaskPage === 1) {
      setIsOnStartTaskPage(true);
    } else {
      setIsOnStartTaskPage(false);
    }
  });

  const nextTasksPage = () => {
    const maxTasks = showArchivedTasks
      ? numberOfArchivedTasks
      : numberOfActiveTasks;

    if (currentTaskPage >= 1 && currentTaskPage < Math.ceil(maxTasks / 5)) {
      setCurrentTasksPage(currentTaskPage + 1);
    }
  };
  const previousTasksPage = () => {
    if (currentTaskPage != 1) {
      setCurrentTasksPage(currentTaskPage - 1);
    }
  };

  const switchArchiveTaskPage = () => {
    setShowArchivedTasks(!showArchivedTasks);
    setCurrentTasksPage(1);
  };

  const checkNumberOfTasks = () => {
    if (showArchivedTasks) {
      if (numberOfArchivedTasks <= 5) return true;
    } else {
      if (numberOfActiveTasks <= 5) return true;
    }
  };

  const handleChangeCheckbox = (e) => {
    if (e.target.checked) {
      setFilterStudentTasks([...filterStudentTasks, e.target.value]);
    } else {
      setFilterStudentTasks(
        filterStudentTasks.filter((id) => id !== e.target.value)
      );
    }
    sortedTasks(tasks);
  };

  return (
    <>
      <div className="bg-white h-full rounded-2xl shadow-md">
        <div className="flex items-center mb-2 ml-1 sm:ml-0 px-3 sm:px-5 pt-5">
          <div className="flex items-center gap-3">
            <img src="/tasks_icon.svg" width="20px" />
            <h1 className="text-2xl font-semibold bg-white rounded-2xl text-gray-600">
              Tasks
            </h1>
            {!showArchivedTasks ? (
              <p className="hidden sm:block font-medium text-sm py-1.5 px-3 bg-gray-500 text-white float-none rounded-lg whitespace-nowrap">
                Incomplete: {tasks.length - submissions.length}
              </p>
            ) : (
              <></>
            )}
            {numberOfArchivedTasks > 0 ? (
              <select
                className="block lg:hidden bg-gray-100 py-1.5 px-1 rounded text-sm lg:text-base text-gray-600"
                value={showArchivedTasks}
                onChange={() => switchArchiveTaskPage()}
              >
                <option value={false}>Active</option>
                <option value={true}>Archived</option>
              </select>
            ) : (
              <></>
            )}
          </div>
          <div className="flex items-center ml-auto">
            <Popup
              trigger={
                <button className="hidden sm:flex flex-row items-center py-1 px-2 text-sm sm:mr-2 rounded focus:outline-none">
                  <Funnel
                    className=""
                    color={"#2563eb"}
                    height="17px"
                    width="17px"
                  />
                  <p className="font-medium text-base pl-1 text-blue-600">
                    Filter
                  </p>
                </button>
              }
              position="bottom right"
            >
              {(close) => (
                <div className="px-4 py-4 bg-white shadow-md rounded">
                  <p className="text-lg font-bold my-1">Filter Tasks</p>
                  <form className="w-56">
                    <input
                      type="checkbox"
                      id="incomplete"
                      value="incomplete"
                      name="sort"
                      className="mr-2 mb-2"
                      checked={filterStudentTasks.includes("incomplete")}
                      onChange={handleChangeCheckbox}
                    />
                    <label htmlFor="incomplete" className="text-sm">
                      Incomplete
                    </label>
                    <br />
                    <input
                      type="checkbox"
                      id="completed & ungraded"
                      value="completed & ungraded"
                      name="sort"
                      className="mr-2 mb-2"
                      checked={filterStudentTasks.includes(
                        "completed & ungraded"
                      )}
                      onChange={handleChangeCheckbox}
                    />
                    <label htmlFor="completed & ungraded" className="text-sm">
                      Completed & Ungraded
                    </label>
                    <br />
                    <input
                      type="checkbox"
                      id="completed & graded"
                      value="completed & graded"
                      name="sort"
                      className="mr-2 mb-2"
                      checked={filterStudentTasks.includes(
                        "completed & graded"
                      )}
                      onChange={handleChangeCheckbox}
                    />
                    <label htmlFor="completed & graded" className="text-sm">
                      Completed & Graded
                    </label>
                  </form>
                </div>
              )}
            </Popup>
            {(showArchivedTasks && numberOfArchivedTasks > 0) ||
            (!showArchivedTasks && numberOfActiveTasks > 0) ? (
              <div className="flex items-center">
                <p className="whitespace-nowrap text-gray-500 lg:hidden">
                  {currentTaskPage * 5 - 4} -{" "}
                  {!isOnEndTaskPage
                    ? currentTaskPage * 5
                    : showArchivedTasks
                    ? numberOfArchivedTasks
                    : numberOfActiveTasks}{" "}
                  of{" "}
                  {showArchivedTasks
                    ? numberOfArchivedTasks
                    : numberOfActiveTasks}
                </p>
                <button
                  className="lg:hidden"
                  onClick={() => previousTasksPage()}
                >
                  <ChevronBackOutline
                    color={
                      isOnStartTaskPage || checkNumberOfTasks()
                        ? "#d1d5db"
                        : "#6b7280"
                    }
                    title={""}
                    height="25px"
                    width="25px"
                  />
                </button>
                <button className="lg:hidden" onClick={() => nextTasksPage()}>
                  <ChevronForwardOutline
                    color={
                      isOnEndTaskPage || checkNumberOfTasks()
                        ? "#d1d5db"
                        : "#6b7280"
                    }
                    title={""}
                    height="25px"
                    width="25px"
                  />
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex flex-col overflow-auto h-5/6">
          <div className="hidden lg:block">
            {tasks.length > 0 ? (
              sortedTasks(tasks.filter((t) => t.status === 1)).map(
                (task, i) => {
                  const sub = submissions.filter((s) => s.task === task.id)[0];
                  return (
                    <Task
                      {...{
                        task,
                        sub,
                        i,
                        addSubmission,
                        updateSubmission,
                        reloadSubmission,
                        updateStatus,
                        status: submissionStatuses.filter(
                          (status) => status.task == task.id
                        )[0],
                        classMembers,
                        name,
                      }}
                      key={task.id}
                    />
                  );
                }
              )
            ) : (
              <div className="flex items-center justify-center h-full py-8">
                <h2 className="font-medium text-4xl text-center text-gray-400">
                  No Tasks
                </h2>
              </div>
            )}

            {sortedTasks(tasks.filter((t) => t.status !== 1)).length > 0 && (
              <div>
                <div className="flex justify-center items-center">
                  <div className="bg-gray-200 my-4 h-1 w-full ml-6 mx-8"></div>
                </div>
                <h1 className="text-2xl font-semibold mb-4 ml-6">Archived</h1>
              </div>
            )}

            {sortedTasks(tasks.filter((t) => t.status !== 1)).map((task, i) => {
              const sub = submissions.filter((s) => s.task === task.id)[0];
              return (
                <Task
                  {...{
                    task,
                    sub,
                    i,
                    addSubmission,
                    updateSubmission,
                    reloadSubmission,
                    updateStatus,
                    status: submissionStatuses.filter(
                      (status) => status.task == task.id
                    )[0],
                    classMembers,
                    name,
                  }}
                  key={task.id}
                />
              );
            })}
          </div>

          <div className="lg:hidden pb-6">
            {!showArchivedTasks ? (
              <div>
                {tasks.length > 0 ? (
                  sortedTasks(tasks.filter((t) => t.status === 1))
                    .slice(currentTaskPage * 5 - 5, currentTaskPage * 5)
                    .map((task, i) => {
                      const sub = submissions.filter(
                        (s) => s.task === task.id
                      )[0];
                      return (
                        <Task
                          {...{
                            task,
                            sub,
                            i,
                            addSubmission,
                            updateSubmission,
                            reloadSubmission,
                            updateStatus,
                            status: submissionStatuses.filter(
                              (status) => status.task == task.id
                            )[0],
                            classMembers,
                            name,
                          }}
                          key={task.id}
                        />
                      );
                    })
                ) : (
                  <div className="flex items-center justify-center h-full py-4">
                    <h2 className="font-medium text-2xl text-center text-gray-400">
                      No Tasks
                    </h2>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}

            {showArchivedTasks ? (
              sortedTasks(tasks.filter((t) => t.status !== 1)).map(
                (task, i) => {
                  const sub = submissions.filter((s) => s.task === task.id)[0];
                  return (
                    <Task
                      {...{
                        task,
                        sub,
                        i,
                        addSubmission,
                        updateSubmission,
                        reloadSubmission,
                        updateStatus,
                        status: submissionStatuses.filter(
                          (status) => status.task == task.id
                        )[0],
                        classMembers,
                        name,
                      }}
                      key={task.id}
                    />
                  );
                }
              )
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;


const Task = ({
  task,
  sub,
  i,
  addSubmission,
  updateSubmission,
  reloadSubmission,
  status,
  updateStatus,
  classMembers,
  name,
}) => {

  const [isSubmitted, setIsSubmitted] = useState(!!sub);
  const [isGraded, setIsGraded] = useState(
    sub && [0, 1, 2, 3, 4, 5].includes(sub.stars)
  );
const [selectedStudents, setSelectedStudents] = useState([name]);

const handleStudentSelection = (event) => {
  const studentId = event.target.value;
  if (event.target.checked) {
    setSelectedStudents([...selectedStudents, studentId]);
  } else {
    setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
  }
};

const handleCancelSelection = () => {
  setSelectedStudents([name]);
};

  return (
    <CustomPopup
      trigger={
        <div className="py-1 px-2 my-3 mx-3 sm:mx-5 cursor-pointer hover:bg-gray-200 bg-gray-100 rounded-xl max-w-full">
          <div className="flex items-center w-full py-2">
            <div
              className={`${
                isSubmitted ? "bg-green-600" : "bg-red-500"
              } w-2 h-16 ml-1 sm:ml-2 rounded-2xl flex-none`}
            ></div>
            <div className=" w-9/12 ml-2 sm:ml-4">
              <span className="flex items-center">
                <h2 className="text-lg font-semibold truncate">{task.name}</h2>
                <p
                  className={`${
                    isSubmitted ? "bg-green-600" : "bg-red-500"
                  } hidden sm:block py-0.5 px-1 text-sm text-white rounded whitespace-nowrap ml-2`}
                >
                  {isSubmitted ? "Done" : "Not Done"}
                </p>
                {isGraded && (
                  <p className="ml-2 py-0.5 px-1 text-sm text-white bg-gray-700 rounded">
                    Graded
                  </p>
                )}
              </span>
              {task.is_group ? (
                <p className="my-1 font-regular text-gray-600 text-sm">
                  Group Submission
                </p>
              ) : (
                <p className="my-1 font-regular text-gray-600 text-sm">
                  Individual Submission
                </p>
              )}

              {task.description ? (
                <p className="my-1 font-medium text-gray-400 text-sm truncate">
                  {task.description}
                </p>
              ) : (
                <p className="my-1 font-regular italic text-gray-400 text-sm">
                  No Description
                </p>
              )}
            </div>
            {task.max_stars > 0 ? (
              <h1
                className={`text-xl ml-auto sm:mr-4 whitespace-nowrap ${
                  isGraded ? "text-yellow-600" : "text-gray-500"
                }`}
              >
                {isGraded ? sub.stars : "-"}/{task.max_stars} ★
              </h1>
            ) : (
              <div style={{ height: "48px" }}></div>
            )}
          </div>
        </div>
      }
      contentStyle={{
        overflowY: "auto",
        marginTop: "min(60px, 100%)",
        marginBottom: "min(60px, 100%)",
      }}
    >
      {(close) => (
        <div className="px-4 py-4 bg-white rounded-lg shadow-lg popup">
          <h1 className="my-2 mx-2 text-2xl font-bold">{task.name}</h1>
          <p className="my-2 mx-2 pb-4 border-b-2 border-gray-200 whitespace-pre-wrap">
            <CustomLinkify>{task.description}</CustomLinkify>
          </p>

          {isSubmitted ? (
            <>
              <Submission sub={sub} reloadSubmission={reloadSubmission} />
              {!isGraded ? (
                <SubmissionForm
                  task={task}
                  addSubmission={addSubmission}
                  updateSubmission={updateSubmission}
                  close={close}
                  isUpdate={true}
                  sub={sub}
                  team_students={selectedStudents}
                  setIsSubmitted={setIsSubmitted}
                  setIsGraded={setIsGraded}
                />
              ) : (
                <></>
              )}
              <TeacherComment isGraded={isGraded} task={task} sub={sub} />
            </>
          ) : (
            <>
              {task.is_group && (
                <>
                  <div className="mt-2 mb-2">
                    <p>Current members in team: </p>
                    {selectedStudents.length === 0 ? (
                      <p className="text-gray-600">None</p>
                    ) : (
                      selectedStudents.map((student) => (
                        <li className="ml-4">{student}</li>
                      ))
                    )}
                  </div>

                  <label>
                    Select Group Members:
                    {classMembers.map((member) => {
                      if (
                        !selectedStudents.includes(member) &&
                        member.trim() !== name
                      ) {
                        return (
                          <div key={member}>
                            <input
                              className="mr-2"
                              type="checkbox"
                              value={member}
                              onChange={handleStudentSelection}
                            />
                            {member}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </label>

                  <button
                    className="px-1 py-1 mx-1 bg-gray-600 text-xs hover:bg-gray-700 text-white rounded m-2 focus:outline-none"
                    onClick={handleCancelSelection}
                  >
                    Cancel Selection
                  </button>
                </>
              )}
              {!task.is_group && (
                <SubmissionStatus
                  {...{ task, status, updateStatus, selectedStudents }}
                />
              )}
              <SubmissionForm
                task={task}
                addSubmission={addSubmission}
                updateSubmission={updateSubmission}
                close={close}
                isUpdate={false}
                sub={sub}
                team_students={selectedStudents}
                setIsSubmitted={setIsSubmitted}
                setIsGraded={setIsGraded}
              />
            </>
          )}
        </div>
      )}
    </CustomPopup>
  );
};

const Submission = ({ sub, reloadSubmission }) => {
  return (
    <div className="w-full">
      <div className="flex flex-row items-center">
        <h2 className="text-xl pt-4 pb-2 pl-2">My Submission</h2>
        {sub?.image && (
          <a
            href={sub.image}
            className="text-sm text-white py-0.5 px-1 ml-2 bg-gray-500 hover:bg-gray-600 rounded"
            download="test.png"
            target="_blank"
          >
            Full Image
          </a>
        )}
      </div>
      <div className="border-2 border-gray-300 rounded mx-2">
        <p className="text-gray-700 px-2 py-2 whitespace-pre-wrap">
          <CustomLinkify>{sub?.text}</CustomLinkify>
        </p>
        {sub?.image && (
          <img
            src={sub.image}
            className="px-2 py-2 mx-auto"
            style={{ maxHeight: 300 }}
            onError={() => reloadSubmission(sub.id)}
          />
        )}
      </div>
    </div>
  );
};

const TeacherComment = ({ isGraded, task, sub }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl pl-2 pt-6">Teacher's Comments</h2>
      {isGraded ? (
        <div className="pl-2 pt-1">
          <p className="text-2xl">
            {"★".repeat(sub.stars) + "☆".repeat(task.max_stars - sub.stars)}
          </p>
          <p className="italic whitespace-pre-wrap">{sub.comments}</p>
        </div>
      ) : (
        <p className="pl-2 pt-2 text-sm italic text-gray-500">
          Submission not reviewed yet.
        </p>
      )}
    </div>
  );
};

const SubmissionStatus = ({ task, status, updateStatus, selectedStudents }) => {
  let subStatus = { status: 0 };
  if (status) subStatus = status;

  return (
    <div className="w-full">
      <h2 className="text-xl pl-2 pt-4">Not done yet?</h2>
      <small className="text-gray-500 pl-2">
        Let your teacher know how you're doing!
      </small>

      <div className="grid grid-cols-3 items-center justify-center gap-4 mt-4 px-2">
        <SubmissionStatusOption
          imgPath="/confused.svg"
          text="Haven't started."
          status={0}
          selected={subStatus.status == 0}
          task={task}
          updateStatus={updateStatus}
          selectedStudents={selectedStudents}
        />
        <SubmissionStatusOption
          imgPath="/happy.svg"
          text="Making progress!"
          status={1}
          selected={subStatus.status == 1}
          task={task}
          updateStatus={updateStatus}
          selectedStudents={selectedStudents}
        />
        <SubmissionStatusOption
          imgPath="/crying.svg"
          text="Need help."
          status={2}
          selected={subStatus.status == 2}
          task={task}
          updateStatus={updateStatus}
          selectedStudents={selectedStudents}
        />
      </div>

      <div className="mx-2 pb-6 border-b"></div>
    </div>
  );
};

const SubmissionStatusOption = ({
  task,
  imgPath,
  text,
  status,
  selected,
  updateStatus,
  selectedStudents,
}) => {
  let optionStyle =
    "flex flex-col items-center gap-2 px-2 py-2 rounded cursor-pointer";
  if (selected) {
    optionStyle += " border-2 border-blue-500";
  }
  if (!task.is_group) {
    optionStyle += " border hover:border-blue-500";
  }
  return (
    <div className="col-span-1">
      <div
        className={optionStyle}
        onClick={() => updateStatus({ taskID: task.id, status, task, selectedStudents })}
      >
        <img src={imgPath} height="50" width="50" />
        <p className="text-sm text-gray-700">{text}</p>
      </div>
    </div>
  );
};

const SubmissionForm = ({
  task,
  addSubmission,
  updateSubmission,
  close,
  isUpdate,
  sub,
  team_students,
  setIsSubmitted, 
  setIsGraded,
}) => {
  const [textInput, setTextInput] = useState("");
  const [fileInput, setFileInput] = useState();
  const [editing, setEditing] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();
    // Check if file is an image
    if (fileInput) {
      const n = fileInput.name;
      if (
        !(
          n.includes("jpg") |
          n.includes("JPG") |
          n.includes("jpeg") |
          n.includes("JPEG") |
          n.includes("png") |
          n.includes("PNG")
        )
      )
        return;
    }
    if (isUpdate) {
      updateSubmission(textInput, fileInput, sub.id, task.id);
    } else {
      addSubmission(task, textInput, fileInput, task.id, team_students, setIsSubmitted, setIsGraded);
    }
    setTextInput("");
    setFileInput(null);
    close();
  };

  if (isUpdate) {
    if (!editing) {
      if (!task.is_group) {
        return (
          <button
            className="mt-4 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded m-2 focus:outline-none"
            onClick={() => setEditing(true)}
          >
            Edit Submission
          </button>
        );
      }
    } 
  } else {
    return (
      <div className="w-full">
        <h2 className="text-xl pl-2 pt-4">Submit</h2>
        {!task.is_group ? (
          <small className="text-gray-500 pl-2">
            Both text and images are accepted.
          </small>
        ) : (
          <small className="text-gray-500 pl-2">
            Text and links are accepted.
          </small>
        )}

        <form onSubmit={(e) => submitForm(e)}>
          <div className="px-2">
            <textarea
              onChange={(e) => setTextInput(e.target.value)}
              className="outline-none border-2 border-gray-100 focus:border-gray-300 px-2 py-2 my-2 rounded-lg w-full"
              rows="4"
              value={textInput}
              name="description"
            />
          </div>
          {!task.is_group && <div className="flex flex-row-reverse items-center">
            <input
              type="file"
              className="bg-gray-400 text-white px-2 py-1 w-min text-sm rounded-lg"
              onChange={(e) => setFileInput(e.target.files[0])}
            />
          </div>}
          <button
            type="submit"
            className="mt-4 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
};
