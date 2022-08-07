const ResourcesPreview = ({ resources, reloadResource }) => {
    if (!resources) return null
    return (
        <>
            <div className="flex items-center gap-3 ml-1 sm:ml-0">
                <img src="/folder_icon.svg" width="25px"/>

                <h1 className="text-xl font-semibold bg-white rounded-2xl text-gray-600">Resources</h1>
            </div>

            <div className="overflow-y-auto h-4/5">
                {(resources.length > 0) ? resources.map((resource, i) => (
                    <>
                        {resource.section && (
                            <div
                                className="flex flex-col mt-3 bg-gray-100 p-4 rounded-lg"
                                key={i}
                            >
                                <h3 className="font-semibold text-base text-blue-600 truncate">{resource.section.name}</h3>
                                <div className="mt-1 flex flex-col">
                                    {resource.resources.slice(-3).map((file, _) => (
                                        <p className="text-sm text-medium my-0.5 text-gray-600 hover:text-blue-700 cursor-pointer truncate" onClick={() => reloadResource(file.id, file, resource, i)}>
                                            {file.name}
                                        </p>
                                    ))}
                                    {(resource.resources.length > 3) ? <p className="text-sm mt-2 text-gray-500 italic">...({resource.resources.length - 3}) more {(resource.resources.length - 3 > 1) ? 'files' : 'file'}</p> : <div></div>}

                                </div>
                            </div>
                        )}
                    </>
                )) :
                <div className=" h-full flex items-center justify-center">
                    <h2 className="font-medium text-2xl text-center text-gray-400">No Resources</h2>
                </div>}
            </div>
        </>
    )
}

export default ResourcesPreview;
