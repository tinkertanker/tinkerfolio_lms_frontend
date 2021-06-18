import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Popup from 'reactjs-popup'
import useWebSocket from 'react-use-websocket'
import { ClipboardOutline, CheckmarkSharp } from 'react-ionicons'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { AuthContext } from '../../../contexts/Auth.Context'
import { ClassroomsContext } from '../../../contexts/Classrooms.Context'

import Dashboard from '../../../components/teacher/Dashboard'
import Settings from '../../../components/teacher/Settings'

const Classroom = () => {
    const router = useRouter()
    const { auth, setAuth, getAccessToken } = useContext(AuthContext)
    const { classrooms, setClassrooms } = useContext(ClassroomsContext)

    const [classroom, setClassroom] = useState()
    const [tasks, setTasks] = useState([])
    const [submissions, setSubmissions] = useState()
    const [isDashboard, setIsDashboard] = useState(true)
    const [names, setNames] = useState()

    const [wsURL, setWSURL] = useState(null)
    const {
        sendJsonMessage , lastMessage, readyState,
    } = useWebSocket(wsURL, {
        onOpen: () => console.log('opened'),
        onMessage: (msg) => handleMessage(JSON.parse(msg.data)),
        shouldReconnect: () => false
    })

    useEffect(() => {
        const { code } = router.query
        if (!code) return

        setWSURL(process.env.NEXT_PUBLIC_BACKEND_WS_BASE+'ws/teacher/?token='+auth.tokens.access+'&code='+code)

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
    }, [router.query])

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
        if ((tasks) && (classroom) && (!submissions)) {
            getAccessToken().then((accessToken) => {
                axios.get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/submissions/', {
                    headers: {'Authorization': 'Bearer '+accessToken},
                    params: {'code': classroom.code}
                })
                .then(res => {
                    console.log(res.data)
                    setSubmissions(res.data)
                })
            })
        }
    }, [tasks, classroom, submissions])

    const handleMessage = (msg) => {
        if (Object.keys(msg)[0] === 'submission') {
            setSubmissions([...submissions.filter(sub => sub.id !== msg.submission.id), msg.submission])
        }
    }

    const changePage = () => {
        setIsDashboard(!isDashboard)
    }

    const changeStatus = () => {
        const newClassroom = {...classroom, status: classroom.status === 1 ? 2 : 1}
        updateClassroom(newClassroom)
    }

    const removeIndex = (index) => {
        const newClassroom = {...classroom, student_indexes: classroom.student_indexes.filter(i => i !== parseInt(index))}
        updateClassroom(newClassroom)
    }

    const addStudent = () => {
        // New student will have the largest index number
        const newIndex = Math.max(...classroom.student_indexes)+1
        const newClassroom = {...classroom, student_indexes: [...classroom.student_indexes, newIndex]}
        setNames([...names, {index:newIndex, name:""}])
        updateClassroom(newClassroom)
    }

    const updateClassroom = (newClassroom) => {
        getAccessToken().then((accessToken) => {
            axios.put(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/classrooms/'+newClassroom.id+'/', newClassroom, {
                headers: {'Authorization': 'Bearer '+accessToken},
            })
            .then(res => {
                setClassroom(res.data)
                setClassrooms([...classrooms.filter(cr => cr.id !== res.data.id), res.data])
            })
        })
    }

    const updateName = (index, name, id) => {
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

    return (
        <div>
            <Head>
                <title>Teacher | LMS</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            { classroom && (
                <div className="flex sm:flex-row flex-col min-h-screen">
                    <div className="flex flex-col pt-10 px-4 bg-white whitespace-nowrap">
                        <h1 className="text-3xl font-bold px-2">{classroom.name}</h1>
                        <p className={`${classroom.status === 1 ? "text-green-600" : "text-red-500"} px-2 mb-4 font-bold`}>{classroom.status === 1 ? 'Active' : 'Archived'}</p>
                        <button className={`${isDashboard ? "bg-gray-200" : "hover:bg-gray-200"} text-lg font-semibold px-2 py-1 mt-1 text-left rounded-lg`} onClick={changePage}>Dashboard</button>
                        <button className={`${(!isDashboard) ? "bg-gray-200" : "hover:bg-gray-200"} text-lg font-semibold px-2 py-1 my-1 text-left rounded-lg`} onClick={changePage}>Settings</button>

                        <ClassCode code={classroom.code} />

                    </div>
                    <div className="pt-8 px-8">
                        { isDashboard ?
                            <Dashboard {...{
                                classroom, removeIndex, addStudent,names,
                                updateName, tasks, setTasks,
                                submissions, setSubmissions, sendJsonMessage
                            }} /> :
                            <Settings classroom={classroom} changeStatus={changeStatus} />
                        }
                    </div>
                </div>
            )}

            <footer>
            </footer>
        </div>
    )
}

export default Classroom

const ClassCode = ({code}) => {

    const [isCopied, setIsCopied] = useState(false)

    const hasCopied = () => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 3000)
    }

    return (
        <Popup
            trigger={
                <div className="flex flex-col mt-8 px-2 py-2 text-lg bg-black rounded-lg text-white">
                    <div><p className="text-base pb-1">Your class code is</p></div>
                    <div><p className="text-center py-1 font-mono bg-white text-black rounded cursor-pointer hover:bg-gray-100">{code}</p></div>
                </div>
            }
            modal overlayStyle={{ background: 'rgba(0,0,0,0.4)' }}
        >
            { close => (
                <div className="flex flex-col px-4 py-4 bg-white rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-center">Classroom Code</h1>
                        { isCopied ? (
                            <CheckmarkSharp color={'#10B981'} cssClasses="ml-2" height="30px" width="30px" />
                        ) : (
                            <CopyToClipboard className="cursor-pointer" text={code} onCopy={hasCopied}>
                                <ClipboardOutline beat cssClasses="ml-2" height="30px" width="30px" />
                            </CopyToClipboard>
                        )}
                    </div>
                    <div className="flex flex-row mt-4">
                        { [...code].map((char, i) => (
                            <p className="font-mono text-5xl sm:text-7xl text-white py-2 px-2 bg-black ml-1" key={i}>{char}</p>
                        ))}
                    </div>
                </div>
            )}
        </Popup>
    )
}
