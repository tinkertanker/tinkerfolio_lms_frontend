import { useEffect } from "react";
import CustomPopup from "../../utils/CustomPopup";

// leaderboard is the list of students in the classroom
const Leaderboard = ({ profile, leaderboard, classroom }) => {
  const getLeaderboard = () => {
    return leaderboard.sort((a, b) => (a.score <= b.score ? 1 : -1));
  };

  if (!profile || !leaderboard) return null;

  return (
    <StudentStats
      {...{
        profile,
        getLeaderboard,
        classroom,
      }}
    />
  );
};

export default Leaderboard;

const StudentStats = ({ profile, getLeaderboard, classroom }) => {
  return (
    <CustomPopup
      trigger={
        <div className="flex items-center justify-between bg-gray-600 hover:bg-gray-700 py-5 sm:px-6 rounded-2xl shadow-lg cursor-pointer h-full min-h-full">
          {classroom && (
            <h1 className="text-3xl font-bold pl-3 sm:pl-5 text-white ">
              {classroom.name}
            </h1>
          )}

          <div className="text-white sm:px-3 rounded-lg mr-4">
            <div className="flex flex-col justify-center items-center">
              <div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <h1 className="font-semibold text-3xl">★</h1>
                  <h1 className="font-semibold text-2xl xl:text-3xl">
                    {profile.score}
                  </h1>
                  <h1 className="font-light text-3xl xl:text-4xl">|</h1>
                  <img src="/ranking_icon_white.svg" className="w-5" />
                  <h1 className="font-semibold text-2xl xl:text-3xl">
                    #
                    {getLeaderboard().findIndex(
                      (student) => student.studentIndex === profile.studentIndex
                    ) + 1}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      contentStyle={{
        overflowY: "auto",
        marginTop: "min(60px, 100%)",
        marginBottom: "min(60px, 100%)",
      }}
    >
      {(close) => (
        <div className="px-5 py-5 bg-white rounded-xl shadow-lg">
          <div className="sm:mx-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <img src="/ranking_icon.svg" width="25px" />
                <h1 className="font-bold text-2xl sm:text-3xl mx-2">
                  Leaderboard
                </h1>
              </div>

              <button
                onClick={() => {
                  close();
                }}
                className="focus:outline-none font-bold text-2xl mx-2 cursor-pointer text-gray-600"
              >
                ✕
              </button>
            </div>
            {getLeaderboard().map((student, i) => (
              <div
                className={`flex items-center my-3 rounded-xl justify-between ${
                  profile.studentIndex === student.studentIndex
                    ? "bg-green-600"
                    : "bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <h2
                    className={`flex items-center justify-center font-semibold text-xl sm:text-2xl w-8 sm:w-12 h-8 sm:h-12 mx-4 my-2 rounded-full ${
                      i === 0
                        ? "bg-yellow-400"
                        : i === 1
                        ? "bg-gray-400"
                        : i === 2
                        ? "bg-yellow-600"
                        : "bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </h2>
                  <p
                    className={`truncate w-40 sm:w-52 mr-5 ${
                      profile.studentIndex === student.studentIndex &&
                      "text-white"
                    }`}
                  >
                    {student.name.length > 0 ? (
                      student.name
                    ) : (
                      <span className="italic">(Unnamed)</span>
                    )}
                  </p>
                </div>
                <p
                  className={`font-medium text-xl sm:text-2xl mr-3 sm:mx-5 ${
                    profile.studentIndex === student.studentIndex
                      ? "text-white"
                      : "text-red-600"
                  }`}
                >
                  {student.score} ★
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </CustomPopup>
  );
};
