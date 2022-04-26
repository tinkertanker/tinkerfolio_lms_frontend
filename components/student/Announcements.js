import beautifyDate from "../../utils/beautifyDate";
import CustomLinkify from "../../utils/CustomLinkify";

const Announcements = ({announcements}) => {
    return (
        <>
            <h1 className="text-5xl font-semibold mb-8 ml-2">Announcements</h1>
            <div className="mb-4 flex flex-col-reverse">
                {announcements.map((announcement, i) => (
                    <>
                        {announcement.name && (
                            <div
                                className="flex flex-col mt-6 bg-white shadow-md p-4 border rounded-lg"
                                key={i}
                            >
                                <h3 className="font-bold text-xl text-blue-600">{announcement.name}</h3>
                                <p className="my-2 whitespace-pre-wrap">
                                    <CustomLinkify>{announcement.description}</CustomLinkify>
                                </p>
                                <p className="my-2 text-xs text-gray-500">
                                    {beautifyDate(announcement.updated_at.slice(0, 10))}
                                </p>
                            </div>
                        )}
                    </>
                ))}
            </div>
        </>
    )
}

export default Announcements;
