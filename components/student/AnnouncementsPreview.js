import beautifyDate from "../../utils/beautifyDate";
import CustomLinkify from "../../utils/CustomLinkify";
import CustomPopup from "../../utils/CustomPopup";

const AnnouncementsPreview = ({ announcements }) => {

    if (!announcements) return null

    return (
        <>  <div className="flex items-center gap-3">
            <img src="/megaphone_icon.svg" width="25px"/>
            <h1 className="text-xl font-semibold bg-white rounded-2xl">Announcements</h1>
        </div>

            {(announcements.length > 0) ? announcements.slice(-2).map((announcement, i) => {
                return <Announcement {...{ announcement, i }} key={i} />
            }) :
                <div className=" h-3/4 flex items-center justify-center">
                    <h2 className="font-medium text-2xl text-center text-gray-400">No Announcements</h2>
                </div>}

        </>
    )
}

export default AnnouncementsPreview;

const Announcement = ({ announcement, i }) => {

    return (
        <CustomPopup
            trigger={
                <div className="mt-4 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer">
                    <h3 className="font-semibold text-blue-600 truncate">{announcement.name}</h3>
                    <p className="text-sm text-gray-500">
                        {beautifyDate(announcement.updated_at.slice(0, 10))}
                    </p>

                </div>
            }
            contentStyle={{ overflowY: 'auto' }}
        >
            {close => (
                <div className="px-6 py-4 bg-white rounded-lg shadow-lg popup ">
                    <div className="flex items-center justify-between">
                        <h1 className="my-2 text-2xl font-bold">{announcement.name}</h1>
                        <p className="mx-2 text-gray-600">{beautifyDate(announcement.updated_at.slice(0, 10))}</p>
                    </div>
                    <div className="w-full h-0.5 bg-gray-200"></div>
                    <CustomLinkify><p className="my-4">{announcement.description}</p></CustomLinkify>
                    <div className="w-full h-0.5 bg-gray-200"></div>
                    <div className="flex justify-end">
                        <button onClick={() => { close(); }} className="focus:outline-none mt-4 ml-2 px-3 py-1 w-min bg-blue-500 text-white rounded hover:bg-blue-600 font-bold">Close</button>
                    </div>
                </div>
            )}
        </CustomPopup>
    )
}
