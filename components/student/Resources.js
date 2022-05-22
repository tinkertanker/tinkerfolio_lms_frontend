
const Resources = ({ resources, reloadResource }) => {
    if (!resources) return null

    return (
        <>
            <div className="mx-20">
                {(resources.length > 0) ? resources.map((resource, i) => (
                    <>
                        {resource.section && (
                            <div
                                className="flex flex-col my-6 bg-white shadow-md p-6 rounded-lg mb-10"
                                key={i}
                            >
                                <h3 className="font-bold text-xl text-black">{resource.section.name}</h3>
                                <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {resource.resources.map((file, _) =>
                                        <div className="bg-gray-100 hover:bg-gray-200 py-4 px-5 rounded-lg cursor-pointer" onClick={() => reloadResource(file.id, file, resource, i)}>
                                            <div className="flex items-center gap-2">
                                                <FileIcon {...{file}}/>
                                                <p className="text-blue-600 text-sm font-medium truncate ml-2">
                                                    {file.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )) :  
                <div className=" flex items-center justify-center py-40">
                    <h2 className="font-medium text-3xl text-center text-gray-400">No Resources</h2>
                </div>}
            </div>
        </>
    )
}

export default Resources;

//Check file type to render appropriate icon
const FileIcon = ({
    file
}) => {
    const videoFormats = [".mp4", ".mov", ".wmv", ".avi", "flv", ".mkv"];
    const imageFormats1 = [".png", ".jpg", ".gif", ".psd", ".bmp", ".svg", ".raw"]
    const imageFormats2 = [".jpeg", ".tiff", ".heif", ".webp"]
    const audioFormats = [".mp3", ".wav", ".m4a", ".ogg", ".wma"]

    let icon = <div></div>;

    if (videoFormats.indexOf(file.name.slice(-4)) > -1) {
        //video files
        icon = <img src="/video_icon.svg" width="20px"/>
    } else if (imageFormats1.indexOf(file.name.slice(-4)) > -1) {
        //image files (3-character extension)
        icon = <img src="/image_icon.svg" width="20px"/>
    } else if (imageFormats2.indexOf(file.name.slice(-5)) > -1) {
        //image files (4-character extension)
        icon = <img src="/image_icon.svg" width="20px"/>
    } else if (audioFormats.indexOf(file.name.slice(-4)) > -1) {
        //audio files
        icon = <img src="/audio_icon.svg" width="20px"/>
    } else {
        //other files
        icon = <img src="/document_icon.svg" width="20px"/>
    }

    return icon 
}
