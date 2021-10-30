import Head from 'next/head'
import Link from 'next/link'

const Home = () => {
    return (
        <div>
            <Head>
                <title>Home | EchoClass</title>
                <meta name="description" content="EchoClass is an open-source LMS." />
            </Head>

            <main>
                <section className="px-6 bg-purple-50">
                    <div className="max-w-4xl 2xl:max-w-6xl mx-auto pt-12 sm:pt-20 pb-20 sm:pb-28">
                        <h1 className="text-4xl sm:text-6xl pb-4 font-extrabold">Supercharge your teaching.</h1>
                        <h3 className="text-xl sm:text-2xl text-gray-500 mt-2 mb-6">Monitor your students' learning progress, receive task submissions, give feedback — in a fun and interactive way.</h3>
                        <a href="mailto:hello@michaelchen.io?subject=Request for Beta Access to EchoClass" className="py-2 px-4 text-lg font-semibold text-white bg-blue-700 hover:bg-blue-900 rounded">Sign Up for Beta Access</a>
                    </div>
                </section>
                <section className="bg-white">
                    <div className="max-w-4xl 2xl:max-w-6xl mx-auto py-20 sm:py-28 px-8">
                        <h1 className="text-3xl sm:text-5xl font-bold text-center mb-8 sm:mb-16">Made for teachers who care.</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <Testimonial
                                quote="&quot;EchoClass helps our instructors understand how students are doing during a lesson.&quot;"
                                imgPath="yj_testimonials.jfif"
                                name="YJ Soon"
                                position="CEO @ Tinkertanker"
                            />
                            <Testimonial
                                quote="&quot;EchoClass tells me what my students are struggling with so I can tailor my teaching for them.&quot;"
                                imgPath="zj_testimonials.jfif"
                                name="Zhang Jane"
                                position="Lecturer @ Republic Polytechnic"
                            />
                        </div>
                    </div>
                </section>
                <section className="px-6 bg-purple-50">
                    <div className="max-w-4xl 2xl:max-w-6xl mx-auto pt-20 pb-28">
                        <h1 className="text-3xl sm:text-5xl font-bold text-center mb-16">Why EchoClass</h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 justify-items-center">
                            <Feature
                                imgPath="timer_lp.png"
                                title={<h3 className="text-xl sm:text-2xl font-semibold">Setup a class in <a className="text-purple-700 font-bold">17 seconds</a>.</h3>}
                                description="Spend your time investing in students, instead of setting up a piece of tech."
                            />
                            <Feature
                                imgPath="emojis_lp.png"
                                title={<h3 className="text-xl sm:text-2xl font-semibold">Student Status</h3>}
                                description="Are my students following the lesson? Students can indicate their status with emojis."
                            />
                            <Feature
                                imgPath="tasks_lp.png"
                                title={<h3 className="text-xl sm:text-2xl font-semibold">Receive Task Submissions</h3>}
                                description="Students can submit their work, while you can give grades and feedback — all in real-time"
                            />
                            <Feature
                                imgPath="ranking_lp.png"
                                title={<h3 className="text-xl sm:text-2xl font-semibold">Rankings</h3>}
                                description="Give points to good submissions. Motivate students through gamification."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer>
            </footer>
        </div>
    )
}

export default Home

const Testimonial = ({quote, imgPath, name, position}) => {
    return (
        <div className="col-span-1 px-8 py-6 rounded-lg border">
            <p className="text-xl font-semibold">{quote}</p>
            <div className="flex flex-row gap-2 items-center mt-4">
                <img src={imgPath} className="rounded-full" height="35px" width="35px"/>

                <div>
                    <p className="text-lg">{name}</p>
                    <p className="text-gray-500 text-sm">{position}</p>
                </div>
            </div>
        </div>
    )
}

const Feature = ({imgPath, title, description}) => {
    return (
        <div className="flex flex-col place-items-center gap-4">
            <img className="cols-span-1 text-center mb-4" src={imgPath} height="120px" width="120px" />
            {title}
            <p className="text-gray-500 text-center text-sm sm:text-base">{description}</p>
        </div>
    )
}
