import Popup from 'reactjs-popup'

const Dashboard = ({tasks, submissions}) => {
    if ((!tasks) || (!submissions)) return <h1></h1>
    return (
        <div className="flex flex-col">
            <h1 className="text-5xl font-semibold mb-8">Tasks</h1>
            { tasks.filter(t => t.status === 1).map((task, i) => {
                const sub = submissions.filter(s => s.task === task.id)[0]
                return <Task task={task} sub={sub} i={i} />
            })}

            { tasks.filter(t => t.status !== 1).length > 0 && (
                <h1 className="text-2xl font-semibold mb-8 mt-10">Archived</h1>
            )}

            { tasks.filter(t => t.status !== 1).map((task, i) => {
                const sub = submissions.filter(s => s.task === task.id)[0]
                return <Task task={task} sub={sub} i={i} />
            })}
        </div>
    )
}

export default Dashboard

const Task = ({task, sub, i}) => {
    const isSubmitted = sub ? true : false
    const isGraded = sub ? (sub.stars ? true : false) : false

    return (
        <Popup
            trigger={
                <div className="py-2 px-2 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200" key={i}>
                    <div className="flex flex-row items-center">
                        <h2 className="text-lg font-semibold mr-4">{task.name}</h2>
                        <p className={`${isSubmitted ? 'bg-green-600':'bg-red-500'} py-0.5 px-1 text-sm text-white rounded`}>{isSubmitted ? 'Done':'Not Done'}</p>
                    </div>
                    { isGraded && <p className="py-0.5 px-1 text-sm text-white bg-gray-500 rounded">Graded</p>}
                    <p className="text-gray-500">{ isGraded ? sub.stars : '-' }/{task.max_stars} ★</p>
                </div>
            }
            modal
        >
            { close => (
                <div className="px-4 py-4 bg-white rounded-lg shadow-md popup">
                    <h1 className="my-2 mx-2 text-2xl font-bold">{task.name}</h1>
                    <p className="my-2 mx-2">{task.description}</p>

                    { isSubmitted ? <Submission /> : <SubmissionForm />}
                </div>
            )}
        </Popup>
    )
}

const Submission = () => {
    return (
        <h1></h1>
    )
}

const SubmissionForm = () => {
    return (
        <h1></h1>
    )
}
