const Announcements = ({announcements}) => {
    return (
        <>
            <h1 className="text-5xl font-semibold mb-8 ml-2">Announcements</h1>
            <div>
                {announcements.map((announcement, i) => (
                    <>
                        {announcement.name && (
                            <div
                                className="flex flex-col mt-6 bg-white shadow-md p-4 border rounded-lg"
                                key={i}
                            >
                                <h3 className="font-bold text-xl text-blue-600">{announcement.name}</h3>
                                <p className="my-2 whitespace-pre-wrap">{announcement.description}</p>
                            </div>
                        )}
                    </>
                ))}
            </div>
        </>
    )
}

export default Announcements;
