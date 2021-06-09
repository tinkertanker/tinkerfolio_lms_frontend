import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Popup from 'reactjs-popup';

import { AuthContext } from '../contexts/Auth.Context'

const contentStyle = { paddingLeft: '0.5rem', paddingRight: '0.5rem' };
const arrowStyle = { color: '#000' }; // style for an svg element

const Dashboard = ({ classroom, names, removeIndex, addStudent, updateName, tasks, setTasks }) => {

    const { getAccessToken } = useContext(AuthContext)
    const [tableNames, setTableNames] = useState()

    useEffect(() => {
        setTableNames(names)
    }, [names])

    if (!tableNames) return <h1></h1>

    const setOneTask = (newTask) => {
        console.log(true)
        if (newTask !== tasks.find(t => t.id === newTask.id)) {
            // if task has been edited
            getAccessToken().then((accessToken) => {
                axios.put(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/tasks/'+newTask.id.toString()+'/', newTask, {
                    headers: {'Authorization': 'Bearer '+accessToken}
                })
                .then(res => {
                    setTasks([...tasks.filter(t => t.id !== res.data.id), res.data])
                })
            })
        }
    }

    const addTask = (task) => {
        getAccessToken().then((accessToken) => {
            axios.post(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/tasks/', {
                code: classroom.code, ...task
            }, {
                headers: {'Authorization': 'Bearer '+accessToken}
            })
            .then(res => {
                setTasks([...tasks, res.data])
            })
        })
    }

    const deleteTask = (id) => {
        getAccessToken().then((accessToken) => {
            axios.delete(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/tasks/'+id.toString()+'/', {
                headers: {'Authorization': 'Bearer '+accessToken}
            })
            .then(res => {
                setTasks(tasks.filter(t => t.id !== id))
            })
        })
    }

    return (
        <>
            <h1 className="text-5xl font-semibold">Dashboard</h1>

            <div className="flex flex-row">
                <NewTask addTask={addTask} />
                <button className="mt-8 py-1 px-2 bg-gray-400 text-sm text-white rounded hover:bg-gray-600" onClick={addStudent}>Add Student</button>
            </div>

            <table className="mt-6" style={{ display:"block", overflowX:"auto", whiteSpace:"nowrap"}}>
                <thead>
                    <tr className="border-2">
                        <th className="border-r-2 px-2 py-2 "><p>Index</p></th>
                        <th className="border-r-2 px-2 py-2 "><p>Name</p></th>
                        <th className="border-r-2 px-2 py-2 "><p>Actions</p></th>
                        { tasks.map((task, i) => (
                            <th className="border-r-2 px-2 py-2" key={i}>
                                <div className="flex flex-row items-center">
                                    <p>{task.name}</p>
                                    <TaskMenu task={task} setOneTask={setOneTask} deleteTask={deleteTask} />
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    { classroom.student_indexes.map((index, i) => (
                        <tr className="border-2" key={i}>
                            <td className="border-r-2 px-2 py-2 "><p>{index}</p></td>
                            <td className="border-r-2 px-2 py-2"><input
                                onChange={e => setTableNames([...tableNames.filter(n => n.index !== index), {index:index, name: e.target.value}])}
                                onBlur={e => updateName(index, tableNames.filter(n => n.index === index)[0].name)}
                                className="outline-none focus:border-gray-500 border-b-2 border-gray-300 bg-gray-100"
                                value={tableNames.filter(name => name.index === index)[0].name}
                            /></td>
                            <td className="px-2 py-2 border-r-2"><button value={index} className="py-1 px-2 bg-red-500 text-white rounded text-sm hover:bg-red-600" onClick={e => removeIndex(e.target.value)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Dashboard

const TaskMenu = ({task, setOneTask, deleteTask}) => {
    const [isCloseOnDocClick, setIsCloseOnDocClick] = useState(true)

    return (
        <Popup
            trigger={<p className="ml-2 px-2 py-0.5 rounded hover:bg-gray-300 cursor-pointer">⋮</p>}
            position="left top"
            arrow={false}
            closeOnDocumentClick={isCloseOnDocClick}
            {...{ contentStyle, arrowStyle }}
        >
            <div className="flex flex-col bg-gray-700 text-gray-300 py-1 px-3 bg-white rounded w-40">
                <TaskDetails task={task} setOneTask={setOneTask} setIsCloseOnDocClick={setIsCloseOnDocClick} />
                <p className="border-b-2 border-gray-500 py-1 hover:text-white cursor-pointer">Hide</p>
                <DeleteTask id={task.id} setIsCloseOnDocClick={setIsCloseOnDocClick} deleteTask={deleteTask} />
            </div>
        </Popup>
    )
}

const TaskDetails = ({task, setOneTask, setIsCloseOnDocClick}) => {

    const [newTask, setNewTask] = useState()

    useEffect(() => {
        setNewTask(task)
    }, [task])

    if (!newTask) return <h1></h1>

    return (
        <Popup
            trigger={<p className="border-b-2 border-gray-500 py-1 hover:text-white cursor-pointer">Details</p>}
            onOpen={() => setIsCloseOnDocClick(false)} onClose={() => setIsCloseOnDocClick(true)}
            modal
        >
            <div className="flex flex-col px-4 py-4 bg-white rounded-lg w-72 sm:w-96 shadow-md">
                <input
                    onChange={e => setNewTask({...newTask, [e.target.name]:e.target.value})}
                    onBlur={() => setOneTask(newTask)}
                    className="outline-none text-2xl border-b-2 border-white focus:border-gray-300 my-2 mx-2 w-min"
                    value={newTask.name} name="name"
                />
                <textarea
                    onChange={e => setNewTask({...newTask, [e.target.name]:e.target.value})}
                    onBlur={() => setOneTask(newTask)}
                    className=" outline-none text-sm border-2 border-gray-100 focus:border-gray-300 py-2 px-2 my-2 mx-2 rounded-lg"
                    value={newTask.description} name="description"
                />
                <div className="flex flex-row">
                    <div>
                        <label htmlFor="status" className="px-2 pt-2">Status</label>
                        <select
                            onChange={e => setNewTask({...newTask, [e.target.name]: e.target.value})}
                            onBlur={() => setOneTask(newTask)}
                            className="outline-none py-2 px-2 my-1 mx-2 rounded-lg bg-gray-100 w-min"
                            id="status" name="status" value={newTask.status === 1}
                        >
                            <option value={1}>In Progress</option>
                            <option value={2}>Completed</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="max_stars" className="px-2 pt-2">Max. Stars</label>
                        <input
                            onChange={e => setNewTask({...newTask, [e.target.name]: parseInt(e.target.value)})}
                            onBlur={() => setOneTask(newTask)}
                            className="outline-none py-1.5 px-2 bg-gray-100 rounded-lg my-1 mx-2 w-min"
                            name="max_stars" id="max_stars" type="number" min="0" max="5" value={newTask.max_stars}
                        />
                    </div>
                </div>
            </div>
        </Popup>
    )
}

const NewTask = ({addTask}) => {
    const [task, setTask] = useState({name: "", description: "", max_stars: 5})

    return (
        <Popup
            trigger={<button className="mt-8 mr-4 py-1 px-2 bg-gray-500 text-sm text-white rounded hover:bg-gray-600">Add Task</button>}
            modal
        >
            { close => (
                <form
                    className="flex flex-col px-4 py-4 bg-white rounded-lg w-72 sm:w-96 shadow-md"
                    onSubmit={e => {
                        e.preventDefault()
                        addTask(task)
                        close()
                    }}
                >
                    <input
                        onChange={e => setTask({...task, [e.target.name]:e.target.value})}
                        className="outline-none text-2xl border-b-2 border-white focus:border-gray-300 my-2 mx-2 w-min"
                        value={task.name} name="name" placeholder="Task Name"
                    />
                    <textarea
                        onChange={e => setTask({...task, [e.target.name]:e.target.value})}
                        className="outline-none text-sm border-2 border-gray-100 focus:border-gray-300 py-2 px-2 my-2 mx-2 rounded-lg"
                        value={task.description} name="description" placeholder="Task Description"
                    />
                    <label htmlFor="max_stars" className="px-2 pt-2">Max. Stars</label>
                    <input
                        onChange={e => setTask({...task, [e.target.name]: parseInt(e.target.value)})}
                        className="outline-none py-1.5 px-2 bg-gray-100 rounded-lg my-1 mx-2 w-min"
                        name="max_stars" id="max_stars" type="number" min="0" max="5" value={task.max_stars}
                    />
                    <small className="ml-2 text-gray-500">Capped at 5 stars.</small>
                    <button type="submit" className="mt-4 ml-2 px-2 py-1 w-min bg-gray-500 text-white rounded hover:bg-gray-600">Create</button>
                </form>
            )}
        </Popup>
    )
}

const DeleteTask = ({id, deleteTask, setIsCloseOnDocClick}) => {
    return (
        <Popup
            trigger={<p className="py-1 hover:text-white cursor-pointer">Delete</p>}
            onOpen={() => setIsCloseOnDocClick(false)} onClose={() => setIsCloseOnDocClick(true)} modal
        >
            { close => (
                <div className="flex flex-col px-4 py-4 bg-white rounded-lg w-72 sm:w-96">
                    <h1 className="text-xl font-semibold">Are you sure?</h1>
                    <p className="text-gray-500 mt-2">Deleted tasks cannot be recovered.</p>
                    <div className="flex flex-row mt-8">
                        <button className="focus:outline-none w-min px-2 py-1 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded" onClick={() => {deleteTask(id); close()}}>Delete</button>
                        <button className="focus:outline-none w-min ml-auto px-2 py-1 text-white bg-gray-500 hover:bg-gray-600 rounded" onClick={() => close()}>Cancel</button>
                    </div>
                </div>
            )}
        </Popup>
    )
}
