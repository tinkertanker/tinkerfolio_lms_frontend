import beautifyDate from "../../utils/beautifyDate";
import CustomLinkify from "../../utils/CustomLinkify";

const Announcements = ({ announcements }) => {
  if (!announcements) return null;
  return (
    <>
      <div className="mb-4 flex flex-col-reverse sm:mx-20">
        {announcements.length > 0 ? (
          announcements.map((announcement, i) => (
            <>
              {announcement.name && (
                <div
                  className="flex flex-col mt-6 bg-white shadow-md p-4 border rounded-lg"
                  key={i}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-md sm:text-2xl text-blue-600">
                      {announcement.name}
                    </h3>
                    <p className="my-2 text-sm text-gray-500 font-medium">
                      {beautifyDate(announcement.updated_at.slice(0, 10))}
                    </p>
                  </div>
                  <div className="my-2 w-full h-0.5 bg-gray-200"></div>
                  <p className="mt-2 whitespace-pre-wrap">
                    <CustomLinkify>{announcement.description}</CustomLinkify>
                  </p>
                </div>
              )}
            </>
          ))
        ) : (
          <div className=" flex items-center justify-center py-40">
            <h2 className="font-medium text-3xl text-center text-gray-400">
              No Announcements
            </h2>
          </div>
        )}
      </div>
    </>
  );
};

export default Announcements;
