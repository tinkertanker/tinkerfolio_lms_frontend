const Leaderboard = ({profile, leaderboard}) => {

    const getLeaderboard = () => {
        return leaderboard.sort((a, b) => (a.score < b.score) ? 1 : -1)
    }

    return (
        <>
            <h1 className="text-5xl font-semibold mb-8 ml-2">Leaderboard</h1>

            <table className="mt-6 mb-12 block overflow-x-auto teacher-table align-top">
                <thead>
                    <tr className="border-2">
                        <th className="border-r-2 px-2 py-2"><p>#</p></th>
                        <th className="border-r-2 px-2 py-2" style={{width:"200px"}}><p>Name</p></th>
                        <th className="border-r-2 px-2 py-2"><p className="text-xl">★</p></th>
                    </tr>
                </thead>
                <tbody className="align-top">
                    { getLeaderboard().map((student, i) => (
                        <tr className="border-2" key={i}>
                            <td className="border-r-2 px-2 py-2"><p>{i+1}</p></td>
                            <td className={`border-r-2 px-2 py-2 ${(profile.index === student.index) && "bg-gray-200"}`}>
                                <p>{student.name}</p>
                            </td>
                            <td className="border-r-2 px-2 py-2"><p>{student.score}</p></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Leaderboard
