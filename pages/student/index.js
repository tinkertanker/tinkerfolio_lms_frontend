import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import { AuthContext } from '../../contexts/Auth.Context'

import Dashboard from '../../components/student/Dashboard'
import Leaderboard from '../../components/student/Leaderboard'
import Announcements from '../../components/student/Announcements'
import Resources from '../../components/student/Resources'
import AnnouncementsPreview from '../../components/student/AnnouncementsPreview'
import ResourcesPreview from '../../components/student/ResourcesPreview'

import {
    ChevronBackOutline,
} from "react-ionicons";


const StudentHome = () => {
    const router = useRouter()
    const { auth, getAccessToken } = useContext(AuthContext)

    const [profile, setProfile] = useState()
    const [classroom, setClassroom] = useState()
    const [tasks, setTasks] = useState()
    const [submissionStatuses, setSubmissionStatuses] = useState()
    const [submissions, setSubmissions] = useState()
    const [announcements, setAnnouncements] = useState()
    const [resources, setResources] = useState()
    const [leaderboard, setLeaderboard] = useState()

    const [showMain, setShowMain] = useState(true)
    const [showAllAnnouncements, setShowAllAnnouncements] = useState(false)
    const [showAllResources, setShowAllResources] = useState(false)

    const [wsURL, setWSURL] = useState(null)
    const {
        sendJsonMessage, lastMessage, readyState,
    } = useWebSocket(wsURL, {
        onOpen: () => console.log('opened'), // do not remove
        onMessage: (msg) => handleMessage(JSON.parse(msg.data)),
        shouldReconnect: (closeEvent) => true
    })

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Connected',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Disconnected',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];


    useEffect(() => {
        if (auth.tokens) {
            setWSURL(process.env.NEXT_PUBLIC_BACKEND_WS_BASE + 'ws/student/?token=' + auth.tokens.access)
        }
    }, [auth.tokens])

    useEffect(() => {
        if (auth.tokens) {
            setWSURL(process.env.NEXT_PUBLIC_BACKEND_WS_BASE + 'ws/student/?token=' + auth.tokens.access)
        }

        // Get initial data
        getAccessToken().then((accessToken) => {
            axios.get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + 'student/initial/', {
                headers: { 'Authorization': 'Bearer ' + accessToken },
            })
                .then(res => {
                    setProfile(res.data.profile)
                    setClassroom(res.data.classroom)
                    setTasks(res.data.tasks)
                    setSubmissions(res.data.submissions)
                    setSubmissionStatuses(res.data.submission_statuses)
                    setAnnouncements(res.data.announcements)
                    setResources(res.data.resources)
                })

            axios.get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + 'student/leaderboard', {
                headers: { 'Authorization': 'Bearer ' + accessToken },
            })
                .then(res => {
                    setLeaderboard(res.data)
                })
        })
    }, [])

    const reloadResource = (id, existingOneResource, existingResource, index) => {

        if (existingOneResource.file.slice(existingOneResource.file.indexOf("&Expires=") + 9) > Math.floor(Date.now() / 1000)) {
            window.open(existingOneResource.file)
        } else {
            getAccessToken().then((accessToken) => {
                axios.get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "student/resource/" + id.toString() + "/", {
                    headers: { 'Authorization': 'Bearer ' + accessToken },
                })
                    .then(res => {
                        let indexRes = existingResource.resources.indexOf(existingOneResource)
                        existingResource.resources = [...existingResource.resources.slice(0, indexRes), res.data, ...existingResource.resources.slice(indexRes + 1)]

                        setResources([
                            ...resources.filter(r => Object.keys(resources).find(key => resources[key] === r) < index),
                            existingResource,
                            ...resources.filter(r => Object.keys(resources).find(key => resources[key] === r) > index),
                        ])

                        window.open(res.data.file)
                    })
                    .catch(res => {
                        console.log(res)
                    })
            })
        }
    }

    const handleMessage = (msg) => {
        if (Object.keys(msg)[0] === 'task') {
            setTasks([...tasks.filter(t => t.id !== msg.task.id), msg.task])
        } else if (Object.keys(msg)[0] === 'submission') {
            setSubmissions([...submissions.filter(sub => sub.id !== msg.submission.id), msg.submission])
        } else if (Object.keys(msg)[0] === 'announcement') {
            setAnnouncements([...announcements.filter(sub => sub.id !== msg.announcement.id), msg.announcement])
        }
    }

    const statusColor = { Connecting: "text-yellow-600", Connected: "text-green-600", Disconnected: "text-red-600" }
    const statusHexColor = { Connecting: "#D97706", Connected: "#059669", Disconnected: "#DC2626" }

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
    }

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

            {showMain ? <main className="h-full max-w-screen min-w-screen mt-8 mx-5 relative grid grid-cols-1 lg:grid-cols-3 grid-rows-10 lg:grid-rows-dashboard grid-flow-row-dense gap-6 pb-10">
                <div className="px-5col-span-1 lg:col-span-2 row-span-1">
                        <Leaderboard {...{ profile, leaderboard, classroom }} />
                </div>
                <div className="bg-white shadow-lg rounded-2xl col-span-1 lg:col-span-2 row-span-4 ">

                    <Dashboard {...{ tasks, submissions, setSubmissions, submissionStatuses, setSubmissionStatuses, sendJsonMessage }} />

                </div>
                <div className="bg-white shadow-lg px-5 py-5 rounded-2xl row-span-2 col-span-1">
                    <AnnouncementsPreview announcements={announcements} />
                    <div className="relative flex justify-end bottom-0 mt-5">
                        <button className="text-sm font-medium text-blue-600 hover:underline focus:outline-none" onClick={() => changePage("Announcements")}>
                            View All Announcements ({announcements ? announcements.length : <></>})
                        </button>
                    </div>
                </div>
                <div className=" bg-white shadow-lg px-5 py-5 rounded-2xl row-span-3 col-span-1">
                    <ResourcesPreview resources={resources} reloadResource={reloadResource} />
                    <div className="relative flex justify-end bottom-0 mt-5">
                        <button className="text-sm font-medium text-blue-600 hover:underline focus:outline-none" onClick={() => changePage("Resources")}>
                            View All Resources
                        </button>
                    </div>
                </div>
                <div className={`fixed bottom-4 right-4 flex flex-row items-center py-1 px-4 rounded-full bg-white shadow-lg ${statusColor[connectionStatus]}`}>
                    <p className="blinking pr-2">⬤</p>
                    <p>{connectionStatus}</p>
                </div>
            </main> : <></>}
            {showAllAnnouncements ?
                <div className="mt-12 mx-5 pb-10 min-h-screen max-w-screen min-w-screen">
                    <div className="flex items-center justify-between mb-6 mx-20">
                        <h1 className="text-4xl font-semibold">Announcements</h1>
                        <button className="focus:outline-none mt-4 ml-2 px-3 py-1 w-min bg-blue-500 text-white rounded hover:bg-blue-600 font-bold flex items-center justify-center" onClick={() => changePage("Main")}>
                            <ChevronBackOutline color={"#00000"} title={"Back"} height="28px" width="28px" />
                            <p className="text-base mx-2">Back</p>
                        </button>
                    </div>
                    <Announcements announcements={announcements} />
                </div> : <></>}
            {showAllResources ?
                <div className="mt-12 mx-5 pb-10 min-h-screen max-w-screen min-w-screen">
                    <div className="flex items-center justify-between mb-6 mx-20">
                        <h1 className="text-4xl font-semibold">Resources</h1>
                        <button className="focus:outline-none mt-4 px-3 py-1 w-min bg-blue-500 text-white rounded hover:bg-blue-600 font-bold flex items-center justify-center" onClick={() => changePage("Main")}>
                            <ChevronBackOutline color={"#00000"} title={"Back"} height="28px" width="28px" />
                            <p className="text-base mx-2">Back</p>
                        </button>
                    </div>
                    <Resources resources={resources} reloadResource={reloadResource} />
                </div> : <></>}
            <footer>
            </footer>
        </div>


    )
}

export default StudentHome
