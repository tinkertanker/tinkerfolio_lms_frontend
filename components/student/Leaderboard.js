import CustomPopup from "../../utils/CustomPopup";


const Leaderboard = ({ profile, leaderboard }) => {


    const getLeaderboard = () => {
        return leaderboard.sort((a, b) => (a.score <= b.score) ? 1 : -1)
    }


    //Get Ranking of the student one rank above
    const getRankAbove = () => {
        const RankAbove = leaderboard.sort((a, b) => (a.score <= b.score) ? 1 : -1).findIndex(student => student.index === profile.index);

        if (RankAbove % 10 === 1 && RankAbove % 100 != 11) {
            return RankAbove.toString() + "st"
        } else if (RankAbove % 10 === 2 && RankAbove % 100 != 12) {
            return RankAbove.toString() + "nd"
        } else if (RankAbove % 10 === 3 && RankAbove % 100 != 13) {
            return RankAbove.toString() + "rd"
        } else {
            return RankAbove.toString() + "th"
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


    return (
        <StudentStats {...{ profile, getLeaderboard, getRankAboveScore, getRankAbove, getSecondScore }} />

    )
}

export default Leaderboard;

const StudentStats = ({ profile, getLeaderboard, getRankAboveScore, getRankAbove, getSecondScore }) => {

    return (
        <CustomPopup
            trigger={
                <div className="text-white hover:text-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-4">
                        <h1 className="font-semibold text-4xl">★</h1>
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="font-semibold text-3xl">{profile.score}</h1>
                            {(profile.score != 1) ? <p className="text-base"> Stars</p> : <p className="text-base text-center"> Star</p>}
                        </div>
                        <h1 className="font-light text-5xl">|</h1>
                        <img src="/ranking_icon_white.svg" width="40px"/>
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="font-semibold text-3xl">#{
                                getLeaderboard().findIndex(student => student.index === profile.index) + 1}
                            </h1>
                            <p className="text-base text-center">Rank</p>
                        </div>
                        <h1 className="font-light text-5xl">|</h1>
                        <div className="flex flex-col items-center justify-center ml">
                            {
                                (getLeaderboard().findIndex(student => student.index === profile.index) === 0) ? (
                                    <div className="flex flex-col items-center justify-center">
                                        <h1 className="font-semibold text-3xl">{
                                            profile.score - getSecondScore()
                                        } ★</h1>
                                        <p className="text-base text-center">Ahead of 2nd</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <h1 className="font-semibold text-3xl">{
                                            getRankAboveScore() - profile.score
                                        } ★</h1>
                                        <p className="text-base text-center whitespace-nowrap">Behind {getRankAbove()}</p>
                                    </div>

                                )
                            }

                        </div>
                    </div>
                </div>
            }
            contentStyle={{ overflowY: 'auto', marginTop: 'min(60px, 100%)', marginBottom: 'min(60px, 100%)' }}
        >
            {close => (
                <div className="px-5 py-5 bg-white rounded-xl shadow-lg popup">
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                            <img src="/ranking_icon.svg" width="25px"/>
                            <h1 className="font-bold text-3xl mx-2">Leaderboard</h1>
                        </div>

                        <button onClick={() => { close(); }} className="focus:outline-none font-bold text-2xl mx-2 cursor-pointer text-gray-600">✕</button>
                    </div>
                    <div className="mx-2">
                        {getLeaderboard().map((student, i) => (
                            <div className={`flex items-center my-5 rounded-xl justify-between ${(profile.index === student.index) ? "bg-blue-600" : "bg-gray-100"}`}>
                                <div className="flex items-center">
                                    <h2 className={`flex items-center justify-center font-semibold text-2xl w-12 h-12 mx-4 my-2 rounded-full ${(i === 0) ? "bg-yellow-400" : (i === 1) ? "bg-gray-300" : (i === 2) ? "bg-yellow-600" : "bg-gray-300"}`}>{i + 1}</h2>
                                    <p className={`font-medium text-lg truncate ${(profile.index === student.index) && "text-white"}`}>{student.name}</p>
                                </div>
                                <p className={`font-medium text-2xl  mx-5 ${(profile.index === student.index) ? "text-white" : "text-blue-600"}`}>{student.score} ★</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </CustomPopup>
    )
}
