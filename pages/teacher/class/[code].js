import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Popup from 'reactjs-popup'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { ClipboardOutline, CheckmarkSharp, SettingsOutline, InformationCircleOutline } from 'react-ionicons'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { AuthContext } from '../../../contexts/Auth.Context'
import { ClassroomsContext } from '../../../contexts/Classrooms.Context'

import Dashboard from '../../../components/teacher/Dashboard'

import useWindowSize from '../../../utils/windowSize'

const Classroom = () => {
    const router = useRouter()
    const size = useWindowSize()
    const { auth, setAuth, getAccessToken } = useContext(AuthContext)
    const { classrooms, setClassrooms } = useContext(ClassroomsContext)

    const [classroom, setClassroom] = useState()
    const [tasks, setTasks] = useState([])
    const [submissionStatuses, setSubmissionStatuses] = useState()
    const [submissions, setSubmissions] = useState()
    const [names, setNames] = useState()

    const [loadingAddStudent, setLoadingAddStudent] = useState(false)

    const [wsURL, setWSURL] = useState(null)
    const {
        sendJsonMessage , lastMessage, readyState,
    } = useWebSocket(wsURL, {
        onOpen: () => console.log('opened'),
        onMessage: (msg) => handleMessage(JSON.parse(msg.data)),
        shouldReconnect: () => false
    })

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Connected',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Disconnected',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    useEffect(() => {
        console.log('router.query')
        const { code } = router.query
        if (!code) return

        if (auth.tokens) {
            setWSURL(process.env.NEXT_PUBLIC_BACKEND_WS_BASE+'ws/teacher/?token='+auth.tokens.access+'&code='+code)
        }

        if (!classrooms) {
            // Get classrooms data if user went directly to classroom link
            getAccessToken().then((accessToken) => {
                axios.get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/classrooms/', {
                    headers: {'Authorization': 'Bearer '+accessToken},
                })
                .then(res => {
                    setClassroom(res.data.filter(cr => cr.code === code)[0])
                    setClassrooms(res.data)
                })
                .catch(res => {
                    console.log(res)
                })
            })

        } else {
            const classroom = classrooms.filter(classroom => classroom.code === code)[0]
            setClassroom(classroom)
        }

        // Get all task data
        getAccessToken().then((accessToken) => {
            axios.get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/tasks/', {
                headers: {'Authorization': 'Bearer '+accessToken},
                params: {'code': code}
            })
            .then(res => {
                setTasks(res.data)
            })
            .catch(res => {
                console.log(res)
            })
        })
    }, [router.query, auth.tokens])

    useEffect(() => {
        if (!classroom) return

        // Get student profiles
        getAccessToken().then((accessToken) => {
            axios.get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/student_profiles/', {
                headers: {'Authorization': 'Bearer '+accessToken},
                params: {'code': classroom.code}
            })
            .then(res => {
                setNames(res.data)
            })
        })
    }, [classroom])

    useEffect(() => {
        // get all submissions
        if ((tasks) && (classroom) && (!submissions)) {
            getAccessToken().then((accessToken) => {
                axios.get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/submissions/', {
                    headers: {'Authorization': 'Bearer '+accessToken},
                    params: {'code': classroom.code}
                })
                .then(res => {
                    setSubmissions(res.data)
                })
            })

            getAccessToken().then((accessToken) => {
                axios.get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/submission_status/', {
                    headers: {'Authorization': 'Bearer '+accessToken},
                    params: {'code': classroom.code}
                })
                .then(res => {
                    setSubmissionStatuses(res.data)
                })
            })
        }
    }, [tasks, classroom, submissions])

    const handleMessage = (msg) => {
        console.log(msg)
        if (Object.keys(msg)[0] === 'submission') {
            setSubmissions([
                ...submissions.filter(sub => sub.id !== msg.submission.id),
                msg.submission
            ])
        } else if (Object.keys(msg)[0] === 'submission_status') {
            setSubmissionStatuses([
                ...submissionStatuses.filter(status => status.id !== msg.submission_status.id),
                msg.submission_status
            ])
        }
    }

    const changeStatus = () => {
        const newClassroom = {...classroom, status: classroom.status === 1 ? 2 : 1}
        updateClassroom(newClassroom)
    }

    const removeIndex = (index) => {
        const newClassroom = {...classroom, student_indexes: classroom.student_indexes.filter(i => i !== parseInt(index))}
        updateClassroom(newClassroom)
    }

    const addStudent = (name) => {
        // New student will have the largest index number
        let newIndex = 1
        if (classroom.student_indexes.length > 0) {
            newIndex = Math.max(...classroom.student_indexes)+1
        }
        const newClassroom = {...classroom, student_indexes: [...classroom.student_indexes, newIndex]}
        setNames([...names, {index:newIndex, name}])
        updateClassroom(newClassroom)
    }

    const bulkAddStudents = (rawNames) => {
        const newIndexes = [...Array(rawNames.length).keys()].map(i => i+1+Math.max(...classroom.student_indexes))
        const newClassroom = {...classroom, student_indexes: [...classroom.student_indexes, ...newIndexes]}
        const newNames = newIndexes.map((index, i) => ({index, name: rawNames[i]}))

        console.log([...names, ...newNames])
        setNames([...names, ...newNames])
        updateClassroom({...newClassroom, newNames})
    }

    const updateClassroom = (newClassroom) => {
        console.log('newClassroom:', newClassroom)
        getAccessToken().then((accessToken) => {
            axios.put(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/classrooms/'+newClassroom.id+'/', newClassroom, {
                headers: {'Authorization': 'Bearer '+accessToken},
            })
            .then(res => {
                console.log(res.data)
                setClassroom(res.data)
                setClassrooms([...classrooms.filter(cr => cr.id !== res.data.id), res.data])
                // setLoadingAddStudent(false)
            })
        })
    }

    const updateName = (index, name, id) => {
        console.log(index, name, id)
        getAccessToken().then((accessToken) => {
            axios.put(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/student_profiles/'+classroom.id+'/', {
                code: classroom.code, index, name
            }, {
                headers: {'Authorization': 'Bearer '+accessToken},
            })
            .then(res => {
                setNames([...names.filter(n => n.index !== index), {index, name, id}])
            })
        })
    }

    const statusColor = {Connecting:"text-yellow-600", Connected:"text-green-600", Disconnected:"text-red-600"}
    const statusHexColor = {Connecting:"#D97706", Connected:"#059669", Disconnected:"#DC2626"}

    return (
        <div>
            <Head>
                <title>Teacher | EchoClass</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
                <style>{`\
                    .blinking\
                    {\
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

            { classroom && (
                <div className="flex flex-col">
                    <div
                        className="fixed w-full flex flex-row gap-4 items-center bg-gray-600 py-2 px-4 sm:px-8"
                        style={{marginTop: "48px"}}
                    >
                        <h1 className="text-xl font-bold px-2 py-0.5 rounded-lg bg-gray-500 text-white">{classroom.name}</h1>
                        <StudentJoinInfo code={classroom.code} />
                        <SettingsMenu {...{classroom, changeStatus}} />
                    </div>
                    <div className="bg-white">
                        <Dashboard {...{
                            classroom, removeIndex,
                            addStudent, bulkAddStudents, loadingAddStudent, setLoadingAddStudent,
                            names, updateName,
                            tasks, setTasks,
                            submissionStatuses, submissions, setSubmissions, sendJsonMessage,
                            size
                        }} />
                    </div>
                    <div className={`fixed bottom-4 right-4 flex flex-row items-center py-1 px-4 rounded-full bg-white shadow-lg ${statusColor[connectionStatus]}`}>
                        <p className="blinking pr-2">⬤</p>
                        <p>{connectionStatus}</p>
                    </div>
                </div>
            )}

            <footer>
            </footer>
        </div>
    )
}

export default Classroom

const SettingsMenu = ({classroom, changeStatus}) => {
    console.log(classroom.status)
    return (
        <Popup
            trigger={
                <div className="flex flex-row items-center py-1 px-2 rounded bg-gray-500 hover:bg-gray-400 cursor-pointer">
                    <SettingsOutline color='#ffffff' height="20px" width="20px" />
                    <p className="text-sm text-white pl-2">Settings</p>
                </div>
            }
            position="bottom right" arrow={false}
        >
            { close => (
                <div className="mt-4 px-4 py-4 w-72 bg-white shadow-lg rounded">
                    <h2 className="text-gray-500 text-center">Settings</h2>
                    <div className="flex mt-2 mb-4 border"></div>
                    <div className="flex flex-row items-center">
                        <p className="font-semibold">Status</p>
                        <select className="ml-auto border py-0.5 px-2 rounded outline-none" value={classroom.status} onChange={changeStatus}>
                            <option value={1}>Active</option>
                            <option value={2}>Archive</option>
                        </select>
                    </div>
                </div>
            )}
        </Popup>
    )
}

const StudentJoinInfo = ({code}) => {

    const [isCopied, setIsCopied] = useState(false)

    const hasCopied = () => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 3000)
    }

    return (
        <Popup
            trigger={
                <div className="flex flex-row ml-auto items-center py-1 px-2 rounded bg-gray-500 hover:bg-gray-400 cursor-pointer">
                    <InformationCircleOutline color='#ffffff' height="20px" width="20px" />
                    <p className="text-sm text-white pl-2">Join Info for Students</p>
                </div>
            }
            modal overlayStyle={{ background: 'rgba(0,0,0,0.4)' }}
        >
            { close => (
                <div className="flex flex-col px-4 py-4 bg-white rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-center">
                        <h1 className="text-lg sm:text-xl text-center">Join at <a className="text-blue-500 hover:underline" href="https://www.echoclass.com/join" target="_blank" rel="noreferrer">echoclass.com/join</a> using this code.</h1>

                    </div>
                    <div className="flex flex-row items-center justify-center mt-4">
                        <p className="font-mono text-5xl sm:text-7xl tracking-widest text-white py-2 px-2 bg-black ml-1">{code}</p>
                        { isCopied ? (
                            <CheckmarkSharp color={'#10B981'} cssClasses="ml-2" height="45px" width="45px" />
                        ) : (
                            <CopyToClipboard className="cursor-pointer" text={code} onCopy={hasCopied}>
                                <ClipboardOutline beat cssClasses="ml-2" height="45px" width="45px" />
                            </CopyToClipboard>
                        )}
                    </div>
                </div>
            )}
        </Popup>
    )
}

const ClassCode = ({code}) => {

    const [isCopied, setIsCopied] = useState(false)

    const hasCopied = () => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 3000)
    }

    return (
        <Popup
            trigger={
                <div className="mt-4 sm:mt-10 ml-2 text-lg rounded-lg">
                    <div><p className="text-base text-center font-bold text-lg text-gray-500">For Students</p></div>
                    <div><p className="text-center py-1 font-mono font-bold bg-blue text-black rounded cursor-pointer border-2 text-2xl border-blue-300 hover:bg-blue-300">{code}</p></div>
                </div>
            }
            modal overlayStyle={{ background: 'rgba(0,0,0,0.4)' }}
        >
            { close => (
                <div className="flex flex-col px-4 py-4 bg-white rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-center">
                        <h1 className="text-lg sm:text-xl text-center">Join at <a className="text-blue-500 hover:underline" href="https://www.echoclass.com/join" target="_blank" rel="noreferrer">echoclass.com/join</a> using this code.</h1>

                    </div>
                    <div className="flex flex-row items-center justify-center mt-4">
                        <p className="font-mono text-5xl sm:text-7xl tracking-widest text-white py-2 px-2 bg-black ml-1">{code}</p>
                        { isCopied ? (
                            <CheckmarkSharp color={'#10B981'} cssClasses="ml-2" height="45px" width="45px" />
                        ) : (
                            <CopyToClipboard className="cursor-pointer" text={code} onCopy={hasCopied}>
                                <ClipboardOutline beat cssClasses="ml-2" height="45px" width="45px" />
                            </CopyToClipboard>
                        )}
                    </div>
                </div>
            )}
        </Popup>
    )
}
