import { useState, useContext } from 'react'
import Popup from 'reactjs-popup'
import CustomPopup from '../../utils/CustomPopup'
import CustomLinkify from '../../utils/CustomLinkify'
import axios from 'axios'

import { AuthContext } from '../../contexts/Auth.Context'

const contentStyle={ overflowY: 'scroll', margin: '10px auto' }

const Dashboard = ({tasks, submissions, setSubmissions, submissionStatuses, setSubmissionStatuses, sendJsonMessage}) => {

    const { getAccessToken } = useContext(AuthContext)

    const addSubmission = (textInput, fileInput, id) => {

        const formData = new FormData()
        formData.append("task_id", id)
        textInput && formData.append("text", textInput)
        fileInput && formData.append("image", fileInput)

        getAccessToken().then((accessToken) => {
            axios.post(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'student/submission/', formData, {
                headers: {'Authorization': 'Bearer '+accessToken},
            })
            .then(res => {
                setSubmissions([...submissions, res.data])
            })
            .catch(res => {
                console.log(res)
            })
        })
    }

    const updateSubmission = (textInput, fileInput, id, task_id) => {
        try {
            const existingSubmission = submissions.filter(subSubmission => subSubmission.id === id)

            const formData = new FormData()
            formData.append("task_id", task_id)
            textInput && formData.append("text", textInput)
            fileInput && formData.append("image", fileInput)

            getAccessToken().then((accessToken) => {
                axios.put(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'student/submission/'+ existingSubmission[0].id+'/', formData, {
                    headers: {'Authorization': 'Bearer '+accessToken},
                })
                .then(res => {
                    setSubmissions([
                        ...submissions.filter(subSubmission => subSubmission.id !== id),
                        res.data
                    ])
                })
                .catch(res => {
                    console.log("err:", res)
                })
            })
        } catch (error) {
            console.log("Something went wrong...")
        }
    }

    const updateStatus = ({taskID, status}) => {
        const existingStatus = submissionStatuses.filter(substatus => substatus.task === taskID)
        if (existingStatus.length === 1) {
            // status already exists
            getAccessToken().then((accessToken) => {
                axios.put(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'student/submission_status/'+existingStatus[0].id+'/', {status}, {
                    headers: {'Authorization': 'Bearer '+accessToken},
                })
                .then(res => {
                    setSubmissionStatuses([
                        ...submissionStatuses.filter(substatus => substatus.task !== taskID),
                        res.data
                    ])
                })
                .catch(res => {
                    console.log(res)
                })
            })
        } else {
            // status does not exist yet
            getAccessToken().then((accessToken) => {
                axios.post(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'student/submission_status/', {
                    task_id: taskID, status
                }, {
                    headers: {'Authorization': 'Bearer '+accessToken},
                })
                .then(res => {
                    setSubmissionStatuses([
                        ...submissionStatuses.filter(substatus => substatus.task !== taskID),
                        res.data
                    ])
                })
                .catch(res => {
                    console.log(res)
                })
            })
        }
    }

    const reloadSubmission = (id) => {
        // When image URL expires
        getAccessToken().then((accessToken) => {
            axios.get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'student/submission/'+id.toString()+'/', {
                headers: {'Authorization': 'Bearer '+accessToken},
            })
            .then(res => {
                setSubmissions([...submissions.filter(s => s.id !== res.data.id), res.data])
            })
            .catch(res => {
                console.log(res)
            })
        })
    }

    if ((!tasks) || (!submissions) || (!submissionStatuses)) return <h1></h1>

    const sortedTasks = (tasks) => {
        const getPriority = (id) => {
            const sub = submissions.filter(s => s.task === id)[0]
            console.log(sub)
            const isSubmitted = sub ? true : false
            const isGraded = sub ? ([0,1,2,3,4,5].includes(sub.stars) ? true : false) : false

            if (!isSubmitted) return 2
            if (isSubmitted && isGraded) return 1
            return 0
        }

        return tasks.sort((a, b) => (getPriority(a.id) < getPriority(b.id)) ? 1 : -1)
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-5xl font-semibold mb-8 ml-2">Tasks</h1>
            { sortedTasks(tasks.filter(t => t.status === 1)).map((task, i) => {
                const sub = submissions.filter(s => s.task === task.id)[0]
                return <Task {...{task, sub, i, addSubmission, updateSubmission, reloadSubmission, updateStatus, status: submissionStatuses.filter(status => status.task == task.id)[0]}} key={i} />
            })}

            { tasks.filter(t => t.status !== 1).length > 0 && (
                <h1 className="text-2xl font-semibold mb-6 mt-12 ml-2">Archived</h1>
            )}

            { sortedTasks(tasks.filter(t => t.status !== 1)).map((task, i) => {
                const sub = submissions.filter(s => s.task === task.id)[0]
                return <Task {...{task, sub, i, addSubmission, updateSubmission, reloadSubmission, updateStatus, status: submissionStatuses.filter(status => status.task == task.id)[0]}} key={i} />
            })}
        </div>
    )
}

export default Dashboard

const Task = ({task, sub, i, addSubmission, updateSubmission, reloadSubmission, status, updateStatus}) => {
    const isSubmitted = sub ? true : false
    const isGraded = sub ? ([0,1,2,3,4,5].includes(sub.stars) ? true : false) : false

    return (
        <CustomPopup
            trigger={
                <div className="pt-3 pb-2 px-2 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200">
                    <div className="flex flex-row items-center">
                        <h2 className="text-lg font-semibold mr-4">{task.name}</h2>
                        <p className={`${isSubmitted ? 'bg-green-600':'bg-red-500'} py-0.5 px-1 text-sm text-white rounded`}>{isSubmitted ? 'Done':'Not Done'}</p>
                        { isGraded && <p className="ml-2 py-0.5 px-1 text-sm text-white bg-gray-700 rounded">Graded</p>}
                    </div>

                    { (task.max_stars > 0) ? <p className="text-gray-500">{ isGraded ? sub.stars : '-' }/{task.max_stars} ★</p> : <div style={{height:"24px"}}></div>}

                </div>
            }
            contentStyle={{ overflowY: 'auto', marginTop: 'min(60px, 100%)', marginBottom: 'min(60px, 100%)' }}
        >
            { close => (
                <div className="px-4 py-4 bg-white rounded-lg shadow-lg popup">
                    <h1 className="my-2 mx-2 text-2xl font-bold">{task.name}</h1>
                    <p className="my-2 mx-2 pb-4 border-b-2 border-gray-200 whitespace-pre-wrap">{task.description}</p>

                    { isSubmitted ? (
                        <>
                            <Submission sub={sub} reloadSubmission={reloadSubmission} />
                            { !isGraded ? (
                                <SubmissionForm task={task} addSubmission={addSubmission} updateSubmission={updateSubmission} close={close} isUpdate={true} sub={sub} />
                            ) : (
                                <></>
                            )}
                            <TeacherComment isGraded={isGraded} task={task} sub={sub} />
                        </>
                    ) : (
                        <>
                            <SubmissionStatus {...{task, status, updateStatus}}/>
                            <SubmissionForm task={task} addSubmission={addSubmission} updateSubmission={updateSubmission} close={close} isUpdate={false} sub={sub} />
                        </>
                    )}

                </div>
            )}
        </CustomPopup>
    )
}

const Submission = ({sub, reloadSubmission}) => {

    return (
        <div className="w-full">
            <div className="flex flex-row items-center">
                <h2 className="text-xl pt-4 pb-2 pl-2">My Submission</h2>
                { sub.image && <a href={sub.image} className="text-sm text-white py-0.5 px-1 ml-2 bg-gray-500 hover:bg-gray-600 rounded" download="test.png" target="_blank">Full Image</a>}
            </div>
            <div className="border-2 border-gray-300 rounded mx-2">
                <p className="text-gray-700 px-2 py-2 whitespace-pre-wrap"><CustomLinkify>{sub.text}</CustomLinkify></p>
                { sub.image && <img src={sub.image} className="px-2 py-2 mx-auto" style={{ maxHeight:300 }} onError={() => reloadSubmission(sub.id)}/>}
            </div>
        </div>
    )
}

const TeacherComment = ({isGraded, task, sub}) => {
    return (
        <div className="w-full">
            <h2 className="text-xl pl-2 pt-6">Teacher's Comments</h2>
            { isGraded ? (
                <div className="pl-2 pt-1">
                    <p className="text-2xl">{'★'.repeat(sub.stars)+'☆'.repeat(task.max_stars - sub.stars)}</p>
                    <p className="italic whitespace-pre-wrap">{sub.comments}</p>
                </div>
            ): (
                <p className="pl-2 pt-2 text-sm italic text-gray-500">Submission not reviewed yet.</p>
            )}
        </div>
    )
}

const SubmissionStatus = ({task, status, updateStatus}) => {
    console.log(status)

    let subStatus = {status: 0}
    if (status) subStatus = status

    return (
        <div className="w-full">
            <h2 className="text-xl pl-2 pt-4">Not done yet?</h2>
            <small className="text-gray-500 pl-2">Let your teacher know how you're doing!</small>

            <div className="grid grid-cols-3 items-center justify-center gap-4 mt-4 px-2">
                <SubmissionStatusOption
                    imgPath="/confused.svg" text="Haven't started."
                    status={0} selected={subStatus.status == 0}
                    task={task} updateStatus={updateStatus}
                />
                <SubmissionStatusOption
                    imgPath="/happy.svg" text="Making progress!"
                    status={1} selected={subStatus.status == 1}
                    task={task} updateStatus={updateStatus}
                />
                <SubmissionStatusOption
                    imgPath="/crying.svg" text="Need help."
                    status={2} selected={subStatus.status == 2}
                    task={task} updateStatus={updateStatus}
                />
            </div>

            <div className="mx-2 pb-6 border-b"></div>
        </div>
    )
}

const SubmissionStatusOption = ({task, imgPath, text, status, selected, updateStatus}) => {

    console.log(selected)

    let optionStyle = "flex flex-col items-center gap-2 px-2 py-2 border rounded cursor-pointer hover:border-blue-500"
    if (selected) optionStyle = "flex flex-col items-center gap-2 px-2 py-2 border-2 border-blue-500 rounded cursor-pointer"

    return (
        <div className="col-span-1">
            <div className={optionStyle} onClick={() => updateStatus({taskID: task.id, status})}>
                <img src={imgPath} height="50" width="50" />
                <p className="text-sm text-gray-700">{text}</p>
            </div>
        </div>
    )
}

const SubmissionForm = ({task, addSubmission, updateSubmission, close, isUpdate, sub}) => {
    const [textInput, setTextInput] = useState("")
    const [fileInput, setFileInput] = useState()
    const [editing, setEditing] = useState(false)

    const submitForm = (e) => {
        e.preventDefault()
        // Check if file is an image
        if (fileInput) {
            const n = fileInput.name
            if (!((n.includes('jpg')) | (n.includes('JPG')) | (n.includes('jpeg')) | (n.includes('JPEG')) | (n.includes('png')) | (n.includes('PNG')))) return
        }
        if (isUpdate) {
            updateSubmission(textInput, fileInput, sub.id, task.id)
        } else {
            addSubmission(textInput, fileInput, task.id)
        }
        setTextInput("")
        setFileInput(null)
        close()
    }

    if (isUpdate) {
        if (!editing) {
            return (
                <button className="mt-4 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded m-2"
                onClick={() => setEditing(true)}>
                    Edit Submission
                </button>
            )
        } else {
            return (
                <div className="w-full">
                    <h2 className="text-xl pl-2 pt-4">Edit</h2>
                    <small className="text-gray-500 pl-2">Both text and images are accepted.</small>
                    <form onSubmit={e => submitForm(e)}>
                        <div className="px-2">
                            <textarea
                                onChange={e => setTextInput(e.target.value)}
                                className="outline-none border-2 border-gray-100 focus:border-gray-300 px-2 py-2 my-2 rounded-lg w-full"
                                rows="4" value={textInput} name="description"
                            />
                        </div>
                        <div className="flex flex-row-reverse items-center">
                            <input type="file" className="bg-gray-400 text-white px-2 py-1 w-min text-sm rounded-lg" onChange={e => setFileInput(e.target.files[0])} />
                        </div>
                        <button type="submit" className="mt-4 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded m-2">Submit</button>
                    </form>
                </div>
            )
        }
    } else {
        return (
            <div className="w-full">
                <h2 className="text-xl pl-2 pt-4">Submit</h2>
                <small className="text-gray-500 pl-2">Both text and images are accepted.</small>
                <form onSubmit={e => submitForm(e)}>
                    <div className="px-2">
                        <textarea
                            onChange={e => setTextInput(e.target.value)}
                            className="outline-none border-2 border-gray-100 focus:border-gray-300 px-2 py-2 my-2 rounded-lg w-full"
                            rows="4" value={textInput} name="description"
                        />
                    </div>
                    <div className="flex flex-row-reverse items-center">
                        <input type="file" className="bg-gray-400 text-white px-2 py-1 w-min text-sm rounded-lg" onChange={e => setFileInput(e.target.files[0])} />
                    </div>
                    <button type="submit" className="mt-4 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded">Submit</button>
                </form>
            </div>
        )
    }
}
