import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import CustomPopup from "../../utils/CustomPopup";
import CustomLinkify from "../../utils/CustomLinkify";

import { AuthContext } from "../../contexts/Auth.Context";

import {
    Filter as FilterIcon,
    AddCircleOutline,
    FunnelOutline,
} from "react-ionicons";
const contentStyle = { paddingLeft: "0.5rem", paddingRight: "0.5rem" };
const arrowStyle = { color: "#374151", paddingBottom: "0.25rem" }; // style for an svg element

const Dashboard = ({
    classroom,
    names,
    removeIndex,
    addStudent,
    bulkAddStudents,
    loadingAddStudent,
    setLoadingAddStudent,
    updateName,
    tasks,
    setTasks,
    submissionStatuses,
    submissions,
    setSubmissions,
    sendJsonMessage,
    size,
}) => {
    const { getAccessToken } = useContext(AuthContext);
    const [tableNames, setTableNames] = useState();
    const [tasksToHide, setTasksToHide] = useState([]);
    const [sortBy, setSortBy] = useState("indexLowToHigh");

    useEffect(() => {
        setTableNames(names);
        console.log("update table names", names);
    }, [names]);

    useEffect(() => {
        setLoadingAddStudent(false);
    }, [tableNames]);

    if (!tableNames) return <h1></h1>;

    const setOneTask = (newTask) => {
        if (newTask !== tasks.find((t) => t.id === newTask.id)) {
            // if task has been edited
            getAccessToken().then((accessToken) => {
                axios
                    .put(
                        process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
                            "core/tasks/" +
                            newTask.id.toString() +
                            "/",
                        newTask,
                        {
                            headers: { Authorization: "Bearer " + accessToken },
                        }
                    )
                    .then((res) => {
                        setTasks([
                            ...tasks.filter((t) => t.id !== res.data.id),
                            res.data,
                        ]);
                    });
            });
        }
    };

    const addTask = (task) => {
        getAccessToken().then((accessToken) => {
            axios
                .post(
                    process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "core/tasks/",
                    {
                        code: classroom.code,
                        ...task,
                    },
                    {
                        headers: { Authorization: "Bearer " + accessToken },
                    }
                )
                .then((res) => {
                    setTasks([...tasks, res.data]);
                });
        });
    };

    const deleteTask = (id) => {
        getAccessToken().then((accessToken) => {
            axios
                .delete(
                    process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
                        "core/tasks/" +
                        id.toString() +
                        "/",
                    {
                        headers: { Authorization: "Bearer " + accessToken },
                    }
                )
                .then((res) => {
                    setTasks(tasks.filter((t) => t.id !== id));
                });
        });
    };

    const addReview = (id, stars, comment) => {
        // push review to server
        getAccessToken().then((accessToken) => {
            axios
                .put(
                    process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
                        "core/submissions/" +
                        id.toString() +
                        "/",
                    {
                        stars,
                        comment,
                    },
                    {
                        headers: { Authorization: "Bearer " + accessToken },
                    }
                )
                .then((res) => {
                    console.log(res.data);
                    setSubmissions([
                        ...submissions.filter((s) => s.id !== res.data.id),
                        res.data,
                    ]);
                });
        });

        // add stars to student's score
        const studentID = submissions.filter((sub) => sub.id === id)[0].student;
        let name = tableNames.filter((name) => name.id === studentID)[0];
        name.score += stars;
        setTableNames([
            ...tableNames.filter((name) => name.id !== studentID),
            name,
        ]);
    };

    const sortedTasks = () => tasks.sort((a, b) => (a.id > b.id ? 1 : -1));

    const sortTableTasks = () => {
        let tasksToShow = tasks.filter(
            (task) => !tasksToHide.includes(task.id)
        );
        return tasksToShow.sort((a, b) => (a.id > b.id ? 1 : -1));
    };

    const sortStudentIndex = () => {
        let sortedTableNames = null;

        switch (sortBy) {
            case "indexLowToHigh":
                return classroom.student_indexes;
                break;
            case "indexHightoLow":
                return classroom.student_indexes.sort((a, b) =>
                    a.id > b.id ? 1 : -1
                );
                break;
            case "starsHighToLow":
                sortedTableNames = tableNames.sort((a, b) =>
                    a.score < b.score ? 1 : -1
                );
                return sortedTableNames.map((n, i) => n.index);
                break;
            case "starsLowToHigh":
                sortedTableNames = tableNames.sort((a, b) =>
                    a.score > b.score ? 1 : -1
                );
                return sortedTableNames.map((n, i) => n.index);
                break;
        }
    };

    // disabling add student when its loading is still not working
    return (
        <>
            <div style={{ height: "96px" }}></div>

            <div className="flex flex-row flex-wrap py-4 gap-4 pl-8 bg-gray-100 shadow-md w-full fixed">
                <Filter {...{ tasks, tasksToHide, setTasksToHide }} />
                <Sort {...{ sortBy, setSortBy }} />
                <NewTask addTask={addTask} />
                <button
                    className={
                        "flex flex-row py-1 px-2 bg-blue-600 text-sm text-white rounded focus:outline-none " +
                        (loadingAddStudent
                            ? "filter brightness-50"
                            : "hover:bg-blue-700")
                    }
                    onClick={() => {
                        if (!loadingAddStudent) {
                            addStudent("");
                            setLoadingAddStudent(true);
                        }
                    }}
                    disabled={loadingAddStudent}
                >
                    <AddCircleOutline color={"#00000"} title={"Add"} height="20px" width="20px" />
                    <p className="pl-1">Student</p>
                </button>
            </div>

            <table
                className="block overflow-y-auto px-8 py-8 w-max min-w-full"
                style={{ height: size.height - 173, borderSpacing: "50px", marginTop: "60px" }}
            >
                {sortBy === "indexHightoLow" ? (
                    <>
                        <thead className="flex">
                            <tr className="border-l-2 border-t-2">
                                <th className="border-r-2 px-2 py-2 w-16">
                                    <p>Index</p>
                                </th>
                                <th className="border-r-2 px-2 py-2 w-72">
                                    <p>Student</p>
                                </th>
                                <th className="border-r-2 px-2 py-2 w-16">
                                    <p className="text-xl">★</p>
                                </th>
                                {sortTableTasks().map((task, i) => (
                                    <th
                                        className="border-r-2 px-2 py-2"
                                        key={i}
                                        style={{ width: "200px" }}
                                    >
                                        {/* this image below is a quick fix to give HTML table a min-width property. DO NOT DELETE */}
                                        <img style={{ float: "left", minWidth: "200px", visibility: "hidden", width: "0px", }} />
                                        <div className="flex flex-row items-center">
                                            <p className="font-normal ml-1 mr-2 py-0.5 px-1 text-sm text-white bg-gray-700 rounded">
                                                Task
                                            </p>
                                            <p
                                                className="truncate text-left"
                                                style={{ width: "150px" }}
                                            >
                                                {task.name}
                                            </p>
                                            <TaskMenu {...{ task, setOneTask, deleteTask, submissions, }} />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="align-top flex flex-col-reverse w-max">
                            {Object.keys(tableNames).map(
                                (studentName, index) => {
                                    const sp = tableNames.filter(
                                        (tn) => tn.index === index
                                    )[0];
                                    if (typeof sp === "undefined") return;
                                    const student_id = sp.id;

                                    return (
                                        <tr
                                            className="border-t-2 border-l-2 border-b-2"
                                            key={index}
                                        >
                                            <td className="border-r-2 px-2 py-2 w-16">
                                                <p>{index}</p>
                                            </td>
                                            <td className="border-r-2 px-3 py-2 w-72">
                                                <div className="flex flex-row">
                                                    <StudentName {...{ index, student_id, tableNames, setTableNames, updateName, bulkAddStudents, removeIndex }} />
                                                    <StudentMenu index={index} removeIndex={ removeIndex } />
                                                </div>
                                                <p className="mt-4 text-sm text-gray-700">
                                                    Submissions
                                                </p>
                                                <SubmissionSummary {...{ student_id, tasks, sortedTasks, submissions, submissionStatuses }} />
                                            </td>
                                            <td className="border-r-2 px-2 py-2 text-center w-16">
                                                {sp.score}
                                            </td>
                                            {submissions &&
                                                sortTableTasks().map(
                                                    (task, i) => {
                                                        let sub =
                                                            submissions.filter(
                                                                (s) =>
                                                                    s.task ===
                                                                        task.id &&
                                                                    s.student ===
                                                                        student_id
                                                            )[0];
                                                        return sub ? (
                                                            <Submission {...{ sub, sp, task, addReview, sendJsonMessage, }} key={i} />
                                                        ) : (
                                                            <td
                                                                className="px-2 py-2 border-r-2"
                                                                key={i}
                                                                style={{ width: "241.36px" }}
                                                            ></td>
                                                        );
                                                    }
                                                )}
                                        </tr>
                                    );
                                })}
                                </tbody>
                    </>
                ) : (
                    <>
                        <thead>
                        <tr className="border-2">
                            <th className="border-r-2 px-2 py-2 w-16">
                                <p>Index</p>
                            </th>
                            <th className="border-r-2 px-2 py-2 w-72">
                                <p>Student</p>
                            </th>
                            <th className="border-r-2 px-2 py-2 w-16">
                                <p className="text-xl">★</p>
                            </th>
                            {sortTableTasks().map((task, i) => (
                                <th
                                    className="border-r-2 px-2 py-2"
                                    key={i}
                                    style={{ width: "200px" }}
                                >
                                    {/* this image below is a quick fix to give HTML table a min-width property. DO NOT DELETE */}
                                    <img style={{ float: "left", minWidth: "200px", visibility: "hidden", width: "0px", }} />
                                    <div className="flex flex-row items-center">
                                        <p className="font-normal ml-1 mr-2 py-0.5 px-1 text-sm text-white bg-gray-700 rounded">
                                            Task
                                        </p>
                                        <p
                                            className="truncate text-left"
                                            style={{ width: "150px" }}
                                        >
                                            {task.name}
                                        </p>
                                        <TaskMenu {...{ task, setOneTask, deleteTask, submissions, }} />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="align-top">
                        {sortBy === "indexLowToHigh" ? (
                            <>
                                {Object.keys(tableNames).map(
                                    (studentName, index) => {
                                        const sp = tableNames.filter(
                                            (tn) => tn.index === index
                                        )[0];
                                        if (typeof sp === "undefined") return;
                                        const student_id = sp.id;

                                        return (
                                            <tr
                                                className="border-2"
                                                key={index}
                                            >
                                                <td className="border-r-2 px-2 py-2 w-16">
                                                    <p>{index}</p>
                                                </td>
                                                <td className="border-r-2 px-2 py-2 w-72">
                                                    <div className="flex flex-row">
                                                        <StudentName {...{ index, student_id, tableNames, setTableNames, updateName, bulkAddStudents, removeIndex }} />
                                                        <StudentMenu index={index} removeIndex={ removeIndex } />
                                                    </div>
                                                    <p className="mt-4 text-sm text-gray-700">
                                                        Submissions
                                                    </p>
                                                    <SubmissionSummary {...{ student_id, tasks, sortedTasks, submissions, submissionStatuses }} />
                                                </td>
                                                <td className="border-r-2 px-2 py-2 text-center w-16">
                                                    {sp.score}
                                                </td>
                                                {submissions &&
                                                    sortTableTasks().map(
                                                        (task, i) => {
                                                            let sub =
                                                                submissions.filter(
                                                                    (s) =>
                                                                        s.task ===
                                                                            task.id &&
                                                                        s.student ===
                                                                            student_id
                                                                )[0];
                                                            return sub ? (
                                                                <Submission {...{ sub, sp, task, addReview, sendJsonMessage, }} key={i} />
                                                            ) : (
                                                                <td
                                                                    className="px-2 py-2 border-r-2"
                                                                    key={i}
                                                                    style={{ width: "241.36px" }}
                                                                ></td>
                                                            );
                                                        }
                                                    )}
                                            </tr>
                                        );
                                    }
                                )}
                            </>
                        ) : (
                            <></>
                        )}
                    </tbody>

                    <tbody className="align-top">
                        <>
                            {sortBy === "starsHighToLow" ||
                            sortBy === "starsLowToHigh" ? (
                                <>
                                    {sortStudentIndex().map((index, i) => {
                                        const sp = tableNames.filter(
                                            (tn) => tn.index === index
                                        )[0];
                                        if (typeof sp === "undefined") return;
                                        const student_id = sp.id;
                                        return (
                                            <tr className="border-2" key={i}>
                                                <td className="border-r-2 px-2 py-2 w-16">
                                                    <p>{index}</p>
                                                </td>
                                                <td className="border-r-2 px-2 py-2 w-72">
                                                    <div className="flex flex-row">
                                                        <StudentName {...{ index, student_id, tableNames, setTableNames, updateName, bulkAddStudents, removeIndex, }} />
                                                        <StudentMenu index={index} removeIndex={ removeIndex } />
                                                    </div>
                                                    <p className="mt-4 text-sm text-gray-700">
                                                        Submissions
                                                    </p>
                                                    <SubmissionSummary {...{ student_id, tasks, sortedTasks, submissions, submissionStatuses, }} />
                                                </td>
                                                <td className="border-r-2 px-2 py-2 text-center w-16">
                                                    {sp.score}
                                                </td>
                                                {submissions &&
                                                    sortTableTasks().map(
                                                        (task, i) => {
                                                            let sub =
                                                                submissions.filter(
                                                                    (s) =>
                                                                        s.task ===
                                                                            task.id &&
                                                                        s.student ===
                                                                            student_id
                                                                )[0];
                                                            return sub ? (
                                                                <Submission {...{ sub, sp, task, addReview, sendJsonMessage, }} key={i} />
                                                            ) : (
                                                                <td
                                                                    className="px-2 py-2 border-r-2"
                                                                    key={i}
                                                                    style={{ width: "241.36px" }}
                                                                ></td>
                                                            );
                                                        }
                                                    )}
                                            </tr>
                                        );
                                    })}
                                </>
                            ) : (
                                <></>
                            )}
                        </>
                    </tbody>
                    </>
                )}
            </table>
        </>
    );
};

export default Dashboard;

const Filter = ({ tasks, tasksToHide, setTasksToHide }) => {
    const handleCheck = (raw_id) => {
        const id = parseInt(raw_id);
        console.log(id);
        console.log(tasksToHide);
        if (tasksToHide.includes(id)) {
            console.log("delete");
            setTasksToHide(tasksToHide.filter((t) => t != id));
        } else {
            console.log("add");
            setTasksToHide([...tasksToHide, id]);
        }
    };

    return (
        <Popup
            trigger={
                <button className="flex flex-row py-1 px-2 bg-blue-600 text-sm text-white rounded hover:bg-blue-700 focus:outline-none">
                    <FilterIcon color={"#ffffff"} height="20px" width="20px" />
                    <p className="pl-2">
                        Filter ({tasks.length - tasksToHide.length})
                    </p>
                </button>
            }
            position="bottom left"
            arrow={false}
            contentStyle={{ paddingTop: "0.5rem" }}
        >
            {(close) => (
                <div className="px-4 py-4 bg-white shadow-md rounded">
                    <p className="text-xl font-bold mb-0.5">Tasks</p>
                    <div className="flex flex-row items-center mb-4 text-sm">
                        <p
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => setTasksToHide([])}
                        >
                            Select All
                        </p>
                        <p className="mx-2">|</p>
                        <p
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() =>
                                setTasksToHide(tasks.map((t) => t.id))
                            }
                        >
                            Unselect All
                        </p>
                    </div>
                    {tasks.map((task, i) => (
                        <div
                            className="flex flex-row items-center mb-2"
                            key={i}
                        >
                            <input
                                type="checkbox"
                                id={task.id}
                                value={task.id}
                                onChange={(e) => handleCheck(e.target.value)}
                                checked={!tasksToHide.includes(task.id)}
                            />
                            <label className="ml-2" htmlFor={task.id}>
                                {task.name}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </Popup>
    );
};

const Sort = ({ sortBy, setSortBy }) => {
    return (
        <Popup
            trigger={
                <button className="flex flex-row items-center py-1 px-2 bg-blue-600 text-sm text-white rounded hover:bg-blue-700 focus:outline-none">
                    <FunnelOutline color={"#ffffff"} height="17px" width="17px" />
                    <p className="pl-2">Sort</p>
                </button>
            }
            position="bottom left"
            arrow={false}
            contentStyle={{ paddingTop: "0.5rem" }}
        >
            {(close) => (
                <div className="px-4 py-4 bg-white shadow-md rounded">
                    <p className="text-xl font-bold mb-3">Sort By</p>

                    <form className="w-56">
                        <input
                            type="radio"
                            id="indexLowToHigh"
                            name="sort"
                            className="mr-2 mb-2"
                            checked={sortBy === "indexLowToHigh"}
                            onClick={() => setSortBy("indexLowToHigh")}
                        />
                        <label for="indexLowToHigh">Index: Low to High</label>
                        <br />
                        <input
                            type="radio"
                            id="indexHightoLow"
                            name="sort"
                            className="mr-2 mb-2"
                            checked={sortBy === "indexHightoLow"}
                            onClick={() => setSortBy("indexHightoLow")}
                        />
                        <label for="indexHightoLow">Index: High to Low</label>
                        <br />
                        <input
                            type="radio"
                            id="starsHighToLow"
                            name="sort"
                            className="mr-2 mb-2"
                            checked={sortBy === "starsHighToLow"}
                            onClick={() => setSortBy("starsHighToLow")}
                        />
                        <label for="starsHighToLow">Stars: High to Low</label>
                        <br />
                        <input
                            type="radio"
                            id="starsLowToHigh"
                            name="sort"
                            className="mr-2 mb-2"
                            checked={sortBy === "starsLowToHigh"}
                            onClick={() => setSortBy("starsLowToHigh")}
                        />
                        <label for="starsLowToHigh">Stars: Low to High</label>
                        <br />
                    </form>
                </div>
            )}
        </Popup>
    );
};

const StudentName = ({
    index,
    student_id,
    tableNames,
    setTableNames,
    updateName,
    bulkAddStudents,
    removeIndex,
}) => {
    const nameChange = (input) => {
        if (/\r|\n/.exec(input)) {
            // if newline is found in string
            console.log("multiline detected");
            console.log(input.split("\n"));

            const inputNames = input.split("\n").filter((e) => e);
            // create new students with subsequent names
            bulkAddStudents(inputNames);
            // delete current row
            // removeIndex(index)
        } else {
            let newTableName = tableNames.filter((n) => n.index === index)[0];
            newTableName.name = input;
            setTableNames([
                ...tableNames.filter((n) => n.index !== index),
                newTableName,
            ]);
        }
    };

    return (
        <textarea
            rows="1"
            onChange={(e) => nameChange(e.target.value)}
            onBlur={(e) =>
                updateName(
                    index,
                    tableNames.filter((n) => n.index === index)[0].name,
                    tableNames.filter((n) => n.index === index)[0].id
                )
            }
            className="bg-transparent resize-none flex-grow outline-none hover:border-gray-400 focus:border-blue-500 border-b-2 border-gray-300"
            value={tableNames.filter((name) => name.index === index)[0].name}
        />
    );
};

const SubmissionSummary = ({
    student_id,
    tasks,
    sortedTasks,
    submissions,
    submissionStatuses,
}) => {
    if (!submissions || !submissionStatuses) return <h1></h1>;
    return (
        <div className="flex flex-row flex-wrap mt-1">
            {sortedTasks().map((task, i) => {
                const sub = submissions.filter(
                    (submission) =>
                        submission.student === student_id &&
                        submission.task === task.id
                )[0];
                const status = submissionStatuses.filter(
                    (status) =>
                        status.student === student_id && status.task === task.id
                )[0];

                let statusIcon = <h1></h1>;
                if (!sub) {
                    // no submission
                    if (!status) {
                        // no status indicated
                        statusIcon = // has not started
                            (
                                <svg width="20" height="20" className="pr-0.5">
                                    <rect
                                        width="14"
                                        height="14"
                                        x="2"
                                        y="2"
                                        rx="2"
                                        ry="2"
                                        className="rounded"
                                        style={{
                                            fill: "#D1D5DB",
                                            stroke: "#9CA3AF",
                                            strokeWidth: "2",
                                        }}
                                    ></rect>
                                </svg>
                            );
                    } else {
                        // status indicated
                        if (status.status === 0) {
                            // has not started
                            statusIcon = (
                                <svg width="20" height="20" className="pr-0.5">
                                    <rect
                                        width="14"
                                        height="14"
                                        x="2"
                                        y="2"
                                        rx="2"
                                        ry="2"
                                        className="rounded"
                                        style={{
                                            fill: "#D1D5DB",
                                            stroke: "#9CA3AF",
                                            strokeWidth: "2",
                                        }}
                                    ></rect>
                                </svg>
                            );
                        } else if (status.status === 1) {
                            // working on it
                            statusIcon = (
                                <svg width="20" height="20" className="pr-0.5">
                                    <rect
                                        width="14"
                                        height="14"
                                        x="2"
                                        y="2"
                                        rx="2"
                                        ry="2"
                                        className="rounded"
                                        style={{
                                            fill: "#FCD34D",
                                            stroke: "#FBBF24",
                                            strokeWidth: "2",
                                        }}
                                    ></rect>
                                </svg>
                            );
                        } else if (status.status === 2) {
                            statusIcon = (
                                <svg width="20" height="20" className="pr-0.5">
                                    <rect
                                        width="14"
                                        height="14"
                                        x="2"
                                        y="2"
                                        rx="2"
                                        ry="2"
                                        className="rounded"
                                        style={{
                                            fill: "#FCA5A5",
                                            stroke: "#F87171",
                                            strokeWidth: "2",
                                        }}
                                    ></rect>
                                </svg>
                            );
                        }
                    }
                } else if (![0, 1, 2, 3, 4, 5].includes(sub.stars)) {
                    // submitted but not reviewed
                    statusIcon = (
                        <svg width="20" height="20" className="pr-0.5">
                            <rect
                                width="14"
                                height="14"
                                x="2"
                                y="2"
                                rx="2"
                                ry="2"
                                className="rounded"
                                style={{
                                    fill: "#6EE7B7",
                                    stroke: "#34D399",
                                    strokeWidth: "2",
                                }}
                            ></rect>
                        </svg>
                    );
                } else {
                    statusIcon = (
                        <svg width="20" height="20" className="pr-0.5">
                            <rect
                                width="14"
                                height="14"
                                x="2"
                                y="2"
                                rx="2"
                                ry="2"
                                className="rounded"
                                style={{
                                    fill: "#10B981",
                                    stroke: "#059669",
                                    strokeWidth: "2",
                                }}
                            ></rect>
                        </svg>
                    );
                }

                return (
                    <Popup
                        key={i}
                        trigger={statusIcon}
                        position="bottom center"
                        on={["hover", "focus"]}
                        arrow
                        arrowStyle={arrowStyle}
                    >
                        <div className="py-1 px-2 bg-gray-700 rounded mb-2">
                            <p className="text-white text-sm">{task.name}</p>
                        </div>
                    </Popup>
                );
            })}
        </div>
    );
};

const Submission = ({ sub, sp, task, addReview, sendJsonMessage }) => {
    const shortened = (text, maxLength) => {
        if (text.length > maxLength)
            return text.substring(0, maxLength) + "...";
        return text;
    };

    return (
        <CustomPopup
            trigger={
                <td className="px-2 py-2 border-r-2 min-w-48 cursor-pointer hover:bg-gray-100">
                    {[0, 1, 2, 3, 4, 5].includes(sub.stars) ? (
                        <p className="text-lg">
                            {"★".repeat(sub.stars) +
                                "☆".repeat(task.max_stars - sub.stars)}
                        </p>
                    ) : (
                        <p className="italic text-xs mb-2">Not reviewed yet.</p>
                    )}
                    <p className="border-t border-gray-300"></p>
                    {sub.text && (
                        <p className="flex-none text-xs text-gray-700 mt-2">
                            {shortened(
                                sub.text,
                                sub.text && sub.image ? 40 : 100
                            )}
                        </p>
                    )}

                    <img
                        className="mt-2"
                        src={sub.image}
                        style={{ maxHeight: "100px" }}
                        onError={() => sendJsonMessage({ submission: sub.id })}
                    />
                </td>
            }
            contentStyle={{
                overflowY: "auto",
                marginTop: "min(5%)",
                height: "max(80%)",
            }}
        >
            <div className="flex flex-col px-4 py-4 bg-white rounded-lg popup">
                <div className="flex flex-row text-xl">
                    <p>Index:</p>
                    <p className="ml-2 font-bold">{sp.index}</p>
                    {sp.name !== "" && (
                        <>
                            <p className="ml-4">Name:</p>
                            <p className="ml-2 font-bold">{sp.name}</p>
                        </>
                    )}
                </div>

                <div className="flex flex-row mt-6 items-center">
                    <h1 className="text-lg font-bold">Submission</h1>
                    {sub.image && (
                        <a
                            href={sub.image}
                            className="text-sm text-white py-0.5 px-1 ml-4 bg-gray-500 hover:bg-gray-600 rounded"
                            download="submission.png"
                            target="_blank"
                        >
                            Full Image
                        </a>
                    )}
                </div>

                <div className="border-2 border-gray-300 rounded mt-4">
                    <p className="ml-2 px-2 py-2 whitespace-pre-wrap">
                        <CustomLinkify>{sub.text}</CustomLinkify>
                    </p>

                    {sub.image && (
                        <img
                            src={sub.image}
                            className="px-2 py-2 mx-auto"
                            style={{ maxHeight: 300 }}
                            onError={() => reloadSubmission(sub.id)}
                        />
                    )}
                </div>

                <p className="border-b-2 border-gray-200 mt-6"></p>

                {[0, 1, 2, 3, 4, 5].includes(sub.stars) ? (
                    <Review sub={sub} task={task} />
                ) : (
                    <ReviewForm sub={sub} task={task} addReview={addReview} />
                )}
            </div>
        </CustomPopup>
    );
};

const Review = ({ sub, task }) => {
    return (
        <>
            <h1 className="text-lg font-bold mt-6">My Review</h1>
            <p className="text-2xl mt-2">
                {"★".repeat(sub.stars) + "☆".repeat(task.max_stars - sub.stars)}
            </p>
            <p className="italic whitespace-pre-wrap">
                {sub.comments !== "" ? sub.comments : "No additonal comments."}
            </p>
        </>
    );
};

const ReviewForm = ({ sub, task, addReview }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [tempStars, setTempStars] = useState(0);
    const [savedStars, setSavedStars] = useState(false);
    const [comment, setComment] = useState("");

    const starIsDark = (i) => {
        if (isHover) {
            if (tempStars >= i) return true;
        } else {
            if (savedStars !== false) {
                if (savedStars >= i) return true;
            }
        }
        return false;
    };

    console.log(task);

    const formSubmit = (e) => {
        console.log(
            "review form submitting",
            savedStars !== false ? savedStars + 1 : 0
        );
        e.preventDefault();
        setIsLoading(true);
        addReview(sub.id, savedStars !== false ? savedStars + 1 : 0, comment);
    };

    return (
        <>
            <h1 className="text-lg font-bold mt-6">Leave a Review</h1>
            <form onSubmit={(e) => formSubmit(e)}>
                <div className="flex flex-row">
                    {Array.from(Array(task.max_stars).keys()).map((a, i) => (
                        <p
                            className="text-2xl cursor-pointer"
                            key={i}
                            onMouseEnter={() => {
                                setIsHover(true);
                                setTempStars(i);
                            }}
                            onMouseLeave={() => setIsHover(false)}
                            onClick={() => setSavedStars(i)}
                        >
                            {starIsDark(i) ? "★" : "☆"}
                        </p>
                    ))}
                </div>
                <textarea
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full outline-none border-2 border-gray-100 focus:border-gray-300 py-2 px-2 my-2 rounded-lg"
                    rows="4"
                    value={comment}
                    name="description"
                    placeholder="Leave a comment..."
                />

                {isLoading ? (
                    <button
                        type="submit"
                        className="px-2 py-1 rounded text-white bg-gray-600"
                        disabled={true}
                    >
                        Submit
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="px-2 py-1 rounded text-white bg-gray-500 hover:bg-gray-600"
                        disabled={savedStars === false && task.max_stars > 0}
                    >
                        Submit
                    </button>
                )}
            </form>
        </>
    );
};

const TaskMenu = ({ task, setOneTask, deleteTask, submissions }) => {
    const [isCloseOnDocClick, setIsCloseOnDocClick] = useState(true);

    if (!submissions) return <h1></h1>;

    return (
        <Popup
            trigger={
                <p className="ml-auto px-2 py-0.5 rounded hover:bg-gray-300 cursor-pointer">
                    ⋮
                </p>
            }
            position="left top"
            arrow={false}
            closeOnDocumentClick={isCloseOnDocClick}
            {...{ contentStyle, arrowStyle }}
        >
            {(close) => (
                <div className="flex flex-col bg-gray-700 text-gray-300 py-1 px-3 rounded w-40">
                    <TaskDetails
                        task={task}
                        setOneTask={setOneTask}
                        setIsCloseOnDocClick={setIsCloseOnDocClick}
                        subs={submissions.filter((s) => s.task === task.id)}
                    />
                    <DeleteTask
                        id={task.id}
                        setIsCloseOnDocClick={setIsCloseOnDocClick}
                        deleteTask={deleteTask}
                        popupClose={close}
                    />
                </div>
            )}
        </Popup>
    );
};

const TaskDetails = ({ task, setOneTask, setIsCloseOnDocClick, subs }) => {
    const [newTask, setNewTask] = useState();

    useEffect(() => {
        setNewTask(task);
    }, [task]);

    if (!newTask) return <h1></h1>;

    const minStars = () => {
        const stars = subs.map((s, i) => s.stars);
        return Math.max(...stars);
    };

    return (
        <CustomPopup
            trigger={
                <p className="border-b-2 border-gray-500 py-1 hover:text-white cursor-pointer">
                    Details
                </p>
            }
            onOpen={() => setIsCloseOnDocClick(false)}
            onClose={() => {
                setIsCloseOnDocClick(true);
                setOneTask(newTask);
            }}
        >
            <div className="flex flex-col px-4 py-4 bg-white rounded-lg shadow-md popup">
                <input
                    onChange={(e) =>
                        setNewTask({
                            ...newTask,
                            [e.target.name]: e.target.value,
                        })
                    }
                    onBlur={() => setOneTask(newTask)}
                    className="outline-none text-2xl border-b-2 border-gray-100 hover:border-gray-300 focus:border-blue-500 my-2 mx-2 w-min"
                    value={newTask.name}
                    name="name"
                />
                <textarea
                    onChange={(e) =>
                        setNewTask({
                            ...newTask,
                            [e.target.name]: e.target.value,
                        })
                    }
                    onBlur={() => setOneTask(newTask)}
                    className=" outline-none text-sm border-2 border-gray-100 hover:border-gray-300 focus:border-blue-500 py-2 px-2 my-2 mx-2 rounded-lg"
                    rows="4"
                    value={newTask.description}
                    name="description"
                />
                <div className="flex flex-row">
                    <div>
                        <label htmlFor="status" className="px-2 pt-2">
                            Status
                        </label>
                        <select
                            onChange={(e) => {
                                console.log(e.target.value);
                                setOneTask({
                                    ...newTask,
                                    [e.target.name]: e.target.value,
                                });
                            }}
                            className="outline-none py-2 px-2 my-1 mx-2 rounded-lg bg-gray-100 w-min"
                            id="status"
                            name="status"
                            value={newTask.status}
                        >
                            <option value={1}>In Progress</option>
                            <option value={2}>Completed</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="max_stars" className="px-2 pt-2">
                            Max. Stars
                        </label>
                        <select
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    [e.target.name]: parseInt(e.target.value),
                                })
                            }
                            onKeyDown={(e) => {
                                e.preventDefault();
                                return false;
                            }}
                            onBlur={() => setOneTask(newTask)}
                            className="outline-none py-1.5 px-2 bg-gray-100 rounded-lg my-1 mx-2 w-min"
                            name="max_stars"
                            id="max_stars"
                            value={newTask.max_stars}
                        >
                            <option value={0}>0</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </div>
                </div>
            </div>
        </CustomPopup>
    );
};

const NewTask = ({ addTask }) => {
    const [task, setTask] = useState({
        name: "",
        description: "",
        max_stars: 5,
    });

    return (
        <CustomPopup
            trigger={
                <button className="flex flex-row py-1 px-2 bg-blue-600 text-sm text-white rounded hover:bg-blue-700 focus:outline-none">
                    <AddCircleOutline
                        color={"#00000"}
                        title={"Add"}
                        height="20px"
                        width="20px"
                    />
                    <p className="pl-1">Task</p>
                </button>
            }
        >
            {(close) => (
                <form
                    className="flex flex-col px-4 py-4 bg-white rounded-lg shadow-md popup"
                    onSubmit={(e) => {
                        e.preventDefault();
                        addTask(task);
                        setTask({ name: "", description: "", max_stars: 5 }); // reset form fields
                        close();
                    }}
                >
                    <input
                        onChange={(e) =>
                            setTask({
                                ...task,
                                [e.target.name]: e.target.value,
                            })
                        }
                        className="outline-none text-2xl border-b-2 border-gray-300 focus:border-gray-500 my-2 mx-2"
                        value={task.name}
                        name="name"
                        placeholder="Enter task name here..."
                        autocomplete="off"
                    />
                    <textarea
                        onChange={(e) =>
                            setTask({
                                ...task,
                                [e.target.name]: e.target.value,
                            })
                        }
                        className="outline-none resize-none text-sm border-2 border-gray-300 focus:border-gray-500 py-2 px-2 my-2 mx-2 rounded-lg"
                        rows="4"
                        value={task.description}
                        name="description"
                        placeholder="Enter task description here..."
                    />
                    <label htmlFor="max_stars" className="px-2 pt-2">
                        Max. Stars
                    </label>
                    <select
                        onChange={(e) =>
                            setTask({
                                ...task,
                                [e.target.name]: parseInt(e.target.value),
                            })
                        }
                        onKeyDown={(e) => {
                            e.preventDefault();
                            return false;
                        }}
                        className="outline-none py-1.5 px-2 bg-gray-100 rounded-lg my-1 mx-2 w-min"
                        name="max_stars"
                        id="max_stars"
                    >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option selected value={5}>
                            5
                        </option>
                    </select>
                    <small className="ml-2 text-gray-500">
                        Capped at 5 stars.
                    </small>
                    <button
                        type="submit"
                        className="mt-4 ml-2 px-2 py-1 w-min bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Create
                    </button>
                </form>
            )}
        </CustomPopup>
    );
};

const DeleteTask = ({ id, deleteTask, setIsCloseOnDocClick, popupClose }) => {
    return (
        <CustomPopup
            trigger={
                <p className="py-1 hover:text-white cursor-pointer">Delete</p>
            }
            onOpen={() => setIsCloseOnDocClick(false)}
            onClose={() => setIsCloseOnDocClick(true)}
        >
            {(close) => (
                <div className="flex flex-col px-6 py-8 bg-white rounded-lg w-56 sm:w-80">
                    <h1 className="text-xl font-semibold text-center">
                        Are you sure?
                    </h1>
                    <p className="text-gray-500 mt-2">
                        This task and its submissions cannot be recovered.
                    </p>
                    <div className="flex flex-col mt-4">
                        <button
                            className="focus:outline-none px-2 py-1 border border-red-300 text-red-500 hover:bg-red-100 hover:border-red-500 hover:text-red-700 rounded mb-2"
                            onClick={() => {
                                deleteTask(id);
                                close();
                                popupClose();
                            }}
                        >
                            Delete
                        </button>
                        <button
                            className="focus:outline-none px-2 py-1 border border-gray-300 hover:bg-gray-100 hover:border-gray-400 rounded"
                            onClick={() => {
                                close();
                                popupClose();
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </CustomPopup>
    );
};

const StudentMenu = ({ index, removeIndex }) => {
    const [isCloseOnDocClick, setIsCloseOnDocClick] = useState(true);

    return (
        <Popup
            trigger={
                <p className="ml-auto px-2 py-0.5 rounded hover:bg-gray-300 cursor-pointer font-bold">
                    ⋮
                </p>
            }
            position="left top"
            arrow={false}
            closeOnDocumentClick={isCloseOnDocClick}
            {...{ contentStyle, arrowStyle }}
        >
            {(close) => (
                <div className="flex flex-col bg-gray-700 text-gray-300 py-1 px-3 rounded w-40">
                    <DeleteStudent
                        {...{
                            removeIndex,
                            index,
                            menuClose: close,
                            setIsCloseOnDocClick,
                        }}
                    />
                </div>
            )}
        </Popup>
    );
};

const DeleteStudent = ({
    index,
    removeIndex,
    menuClose,
    setIsCloseOnDocClick,
}) => {
    return (
        <CustomPopup
            trigger={
                <p className="py-1 hover:text-white cursor-pointer">Delete</p>
            }
            onOpen={() => setIsCloseOnDocClick(false)}
            onClose={() => setIsCloseOnDocClick(true)}
        >
            {(close) => (
                <div className="flex flex-col px-6 py-8 bg-white rounded-lg w-56 sm:w-80">
                    <h1 className="text-xl font-semibold text-center">
                        Are you sure?
                    </h1>
                    <p className="text-gray-500 mt-2">
                        This student's submissions and grades cannot be
                        recovered.
                    </p>
                    <div className="flex flex-col mt-4">
                        <button
                            className="focus:outline-none px-2 py-1 border border-red-300 text-red-500 hover:bg-red-100 hover:border-red-500 hover:text-red-700 rounded mb-2"
                            onClick={() => {
                                removeIndex(index);
                                close();
                                menuClose();
                            }}
                        >
                            Delete
                        </button>
                        <button
                            className="focus:outline-none px-2 py-1 border border-gray-300 hover:bg-gray-100 hover:border-gray-400 rounded"
                            onClick={() => {
                                close();
                                menuClose();
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </CustomPopup>
    );
};
