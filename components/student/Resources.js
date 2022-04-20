const Resources = ({resources}) => {
    return (
        <>
            <h1 className="text-5xl font-semibold mb-8 ml-2">Resources</h1>
            <div>
                {resources.map((resource, i) => (
                    <>
                        {resource.section && (
                            <div
                                className="flex flex-col mt-6 bg-white shadow-md p-4 border rounded-lg"
                                key={i}
                            >
                                <h3 className="font-bold text-xl text-black">{resource.section.name}</h3>
                                <div className="mt-2 flex flex-col ">
                                    {resource.resources.map((file, _) => (
                                        <a className="text-blue-600 hover:text-blue-700" href={file.file} target="_blank">
                                            {file.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ))}
            </div>
        </>
    )
}

export default Resources;
