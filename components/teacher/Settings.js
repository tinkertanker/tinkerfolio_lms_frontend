const Settings = ({ classroom, changeStatus }) => {
    return (
        <>
            <h1 className="text-5xl font-semibold mb-8">Settings</h1>
            {classroom.status === 1 ? (
                <button className="py-1 px-2 bg-red-500 text-white font-bold" onClick={changeStatus}>Archive</button>
            ) : (
                <button className="py-1 px-2 bg-green-600 text-white font-bold" onClick={changeStatus}>Activate</button>
            )}
        </>
    )
}

export default Settings
