import CustomPopup from "../../utils/CustomPopup";


const Leaderboard = ({ profile, leaderboard, classroom }) => {


    const getLeaderboard = () => {
        return leaderboard.sort((a, b) => (a.score <= b.score) ? 1 : -1)
    }


    //Get name of the student one rank above
    const getStudentAbove = () => {
        const sortedLeaderboard = leaderboard.sort((a, b) => (a.score <= b.score) ? 1 : -1);
        const RankAbove = leaderboard.sort((a, b) => (a.score <= b.score) ? 1 : -1).findIndex(student => student.index === profile.index) - 1;
        if (sortedLeaderboard[RankAbove].name.length > 0) {
            if (sortedLeaderboard[RankAbove].name.length > 11) {
                return sortedLeaderboard[RankAbove].name.slice(0, 10) + "..."
            } else {
                return sortedLeaderboard[RankAbove].name
            }
        } else {
            return (<span className="italic">(unnamed)</span>)
        }


    }

    //Get name of the student in second place
    const getSecondStudent = () => {
        const sortedLeaderboard = leaderboard.sort((a, b) => (a.score <= b.score) ? 1 : -1);
        if (sortedLeaderboard[1].name.length > 0) {
            if (sortedLeaderboard[1].name.length > 11) {
                return sortedLeaderboard[1].name.slice(0, 10) + "..."
            } else {
                return sortedLeaderboard[1].name
            }
        } else {
            return (<span className="italic">(unnamed)</span>)
        }


    }

    //Get score of the student one rank above
    const getRankAboveScore = () => {
        const sortedLeaderboard = leaderboard.sort((a, b) => (a.score <= b.score) ? 1 : -1);
        const RankAbove = getLeaderboard().findIndex(student => student.index === profile.index) - 1;
        return sortedLeaderboard[RankAbove].score
    }

    //Get score of student in second place
    const getSecondScore = () => {
        const sortedLeaderboard = leaderboard.sort((a, b) => (a.score <= b.score) ? 1 : -1);
        return sortedLeaderboard[1].score
    }

    if ((!profile) || (!leaderboard)) return null

    return (
        <StudentStats {...{ profile, getLeaderboard, getRankAboveScore, getStudentAbove, getSecondScore, getSecondStudent, classroom }} />

    )
}

export default Leaderboard;

const StudentStats = ({ profile, getLeaderboard, getRankAboveScore, getStudentAbove, getSecondScore, getSecondStudent, classroom }) => {

    return (
        <CustomPopup
            trigger={
                <div className="flex items-center justify-between bg-blue-600 hover:bg-blue-700 py-5 px-6 rounded-2xl shadow-lg cursor-pointer h-full">
                    {classroom && <h1 className="text-3xl font-bold px-2 text-white mx-3">{classroom.name}</h1>}

                    <div className="text-white px-3 rounded-lg mr-4">
                        <div className="flex flex-col justify-center items-center">
                            <div>
                                <div className="flex items-center gap-4">
                                    <h1 className="font-semibold text-3xl">★</h1>
                                    <h1 className="font-semibold text-3xl">{profile.score}</h1>
                                    <h1 className="font-light text-4xl">|</h1>
                                    <img src="/ranking_icon_white.svg" width="30px" />
                                    <h1 className="font-semibold text-3xl">#{
                                        getLeaderboard().findIndex(student => student.index === profile.index) + 1}
                                    </h1>
                                </div>
                            </div>
                            <div className="mt-3">
                                {
                                    (getLeaderboard().findIndex(student => student.index === profile.index) === 0) ? (
                                        <h1 className="text-sm  text-center">{profile.score - getSecondScore()} stars ahead of <span className="font-medium">{getSecondStudent()}</span></h1>
                                    ) : (
                                        <h1 className="text-sm  text-center">{getRankAboveScore() - profile.score} stars behind <span className="font-medium">{getStudentAbove()}</span></h1>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>

            }
            contentStyle={{ overflowY: 'auto', marginTop: 'min(60px, 100%)', marginBottom: 'min(60px, 100%)' }}
        >
            {close => (
                <div className="px-5 py-5 bg-white rounded-xl shadow-lg popup">
                    <div className="mx-4">
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                                <img src="/ranking_icon.svg" width="25px" />
                                <h1 className="font-bold text-3xl mx-2">Leaderboard</h1>
                            </div>

                            <button onClick={() => { close(); }} className="focus:outline-none font-bold text-2xl mx-2 cursor-pointer text-gray-600">✕</button>
                        </div>
                        {getLeaderboard().map((student, i) => (
                            <div className={`flex items-center my-5 rounded-xl justify-between ${(profile.index === student.index) ? "bg-blue-600" : "bg-gray-100"}`}>
                                <div className="flex items-center">
                                    <h2 className={`flex items-center justify-center font-semibold text-2xl w-12 h-12 mx-4 my-2 rounded-full ${(i === 0) ? "bg-yellow-400" : (i === 1) ? "bg-gray-400" : (i === 2) ? "bg-yellow-600" : "bg-gray-200"}`}>{i + 1}</h2>
                                    <p className={`font-medium text-lg truncate ${(profile.index === student.index) && "text-white"}`}>{(student.name.length > 0) ? student.name : <span className="italic">(Unnamed)</span>}</p>
                                </div>
                                <p className={`font-medium text-2xl mx-5 ${(profile.index === student.index) ? "text-white" : "text-blue-600"}`}>{student.score} ★</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </CustomPopup>
    )
}
