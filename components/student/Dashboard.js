import { useState, useContext } from 'react'
import Popup from 'reactjs-popup'
import CustomPopup from '../CustomPopup'
import axios from 'axios'

import { AuthContext } from '../../contexts/Auth.Context'

const contentStyle={ overflowY: 'scroll', margin: '10px auto' }

const Dashboard = ({tasks, submissions, setSubmissions}) => {

    const { getAccessToken } = useContext(AuthContext)

    const addSubmission = (textInput, fileInput, id) => {

        const formData = new FormData()
        formData.append("task_id", id)
        console.log(textInput)
        console.log(fileInput)
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

    if ((!tasks) || (!submissions)) return <h1></h1>

    return (
        <div className="flex flex-col">
            <h1 className="text-5xl font-semibold mb-8 ml-2">Tasks</h1>
            { tasks.filter(t => t.status === 1).map((task, i) => {
                const sub = submissions.filter(s => s.task === task.id)[0]
                return <Task {...{task, sub, i, addSubmission}} key={i} />
            })}

            { tasks.filter(t => t.status !== 1).length > 0 && (
                <h1 className="text-2xl font-semibold mb-6 mt-12 ml-2">Archived</h1>
            )}

            { tasks.filter(t => t.status !== 1).map((task, i) => {
                const sub = submissions.filter(s => s.task === task.id)[0]
                return <Task {...{task, sub, i, addSubmission, reloadSubmission}} key={i} />
            })}
        </div>
    )
}

export default Dashboard

const Task = ({task, sub, i, addSubmission, reloadSubmission}) => {
    const isSubmitted = sub ? true : false
    const isGraded = sub ? (sub.stars ? true : false) : false

    return (
        <CustomPopup
            trigger={
                <div className="py-2 px-2 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200">
                    <div className="flex flex-row items-center">
                        <h2 className="text-lg font-semibold mr-4">{task.name}</h2>
                        <p className={`${isSubmitted ? 'bg-green-600':'bg-red-500'} py-0.5 px-1 text-sm text-white rounded`}>{isSubmitted ? 'Done':'Not Done'}</p>
                        { isGraded && <p className="ml-2 py-0.5 px-1 text-sm text-white bg-gray-700 rounded">Graded</p>}
                    </div>

                    <p className="text-gray-500">{ isGraded ? sub.stars : '-' }/{task.max_stars} ★</p>
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
                            <TeacherComment isGraded={isGraded} task={task} sub={sub} />
                        </>
                    ) : (
                        <SubmissionForm task={task} addSubmission={addSubmission} />
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
                <p className="text-gray-700 px-2 py-2 whitespace-pre-wrap">{sub.text}</p>
                { sub.image && <img src={sub.image} className="px-2 py-2 mx-auto" style={{ maxHeight:300 }} onError={() => reloadSubmission(sub.id)}/>}
            </div>
        </div>
    )
}

// { sub.image ? (
//     <img src={sub.image} className="px-2 py-2 mx-auto" style={{ maxHeight:300 }} onError={() => reloadSubmission(sub.id)}/>
// ):(
//     <p className="text-gray-700 ml-2 px-2 py-2 border-2 border-gray-300 rounded">{sub.text}</p>
// )}

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

const SubmissionForm = ({task, addSubmission}) => {
    const [textInput, setTextInput] = useState("")
    const [fileInput, setFileInput] = useState()

    const submitForm = (e) => {
        e.preventDefault()
        // Check if file is an image
        if (fileInput) {
            const n = fileInput.name
            if (!((n.includes('jpg')) | (n.includes('JPG')) | (n.includes('jpeg')) | (n.includes('JPEG')) | (n.includes('png')) | (n.includes('PNG')))) return
        }
        addSubmission(textInput, fileInput, task.id)
    }

    return (
        <div className="w-full">
            <h2 className="text-xl pl-2 pt-4">Submit</h2>
            <small className="text-gray-500 pl-2">Either text or image submission is accepted.</small>
            <form onSubmit={e => submitForm(e)}>
                <textarea
                    onChange={e => setTextInput(e.target.value)}
                    className="outline-none border-2 border-gray-100 focus:border-gray-300 px-2 py-2 my-2 rounded-lg w-full"
                    rows="4" value={textInput} name="description"
                />
                <div className="flex flex-row-reverse items-center">
                    <input type="file" className="bg-gray-400 text-white px-2 py-1 w-min text-sm rounded-lg" onChange={e => setFileInput(e.target.files[0])} />
                    <p className="text-lg mr-2">or</p>
                </div>
                <button type="submit" className="mt-4 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded">Submit</button>
            </form>

        </div>
    )
}
