import Head from "next/head";
import Link from "next/link";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Home | EchoClass</title>

        <meta property="og:title" content="EchoClass" />
        <meta
          property="og:description"
          content="Monitor your students' learning progress, receive task submissions, give feedback — in a fun and interactive way."
        />
        <meta name="twitter:title" content="EchoClass" />
        <meta
          name="twitter:description"
          content="Monitor your students' learning progress, receive task submissions, give feedback — in a fun and interactive way."
        />

        <style>{`\
                    .ytube {
                        width: 560px;
                        height: 315px
                    }
                `}</style>
      </Head>

      <main>
        <section className="px-2 sm:px-6 bg-purple-50">
          <div
            className="md:hidden block mt-12"
            style={{ padding: "56.25% 0 0 0", position: "relative" }}
          >
            <iframe
              src="https://player.vimeo.com/video/661595554?h=c6aff57f55&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              title="EchoClass"
            ></iframe>
          </div>
          <script src="https://player.vimeo.com/api/player.js"></script>

          <div className="flex md:flex-row flex-col items-center gap-6 sm:gap-8 max-w-5xl 2xl:max-w-7xl mx-auto pt-8 sm:pt-20 pb-20 sm:pb-28">
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-2xl sm:text-4xl 2xl:text-5xl font-semibold sm:text-left text-center pb-4">
                Easy-to-use teaching software
                <br className="hidden sm:block" /> for workshops & webinars.
              </h1>
              <h2 className="text-base sm:text-xl 2xl:text-3xl pb-4 mb-2 sm:text-left text-center text-gray-600">
                Engage your students. Track their progress.
              </h2>
              <a
                href="https://forms.gle/k4Gx4T1Ntvw43JJ17"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-4 text-lg font-semibold text-white bg-blue-700 hover:bg-blue-900 rounded"
              >
                Sign Up for Free
              </a>
            </div>
            <div className="flex-grow md:block hidden">
              <div
                className=""
                style={{ padding: "56.25% 0 0 0", position: "relative" }}
              >
                <iframe
                  src="https://player.vimeo.com/video/661595554?h=c6aff57f55&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  title="EchoClass"
                ></iframe>
              </div>
              <script src="https://player.vimeo.com/api/player.js"></script>
            </div>
          </div>
        </section>
        <section className="bg-white">
          <div className="max-w-4xl 2xl:max-w-6xl mx-auto py-20 sm:py-28 px-8">
            <h1 className="text-3xl sm:text-5xl font-bold text-center mb-8 sm:mb-16">
              Made for instructors who care.
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Testimonial
                quote='"EchoClass helps our instructors understand how students are doing during a lesson."'
                imgPath="/yj_testimonials.jfif"
                name="YJ Soon"
                position="CEO @ Tinkertanker"
              />
              <Testimonial
                quote='"EchoClass tells me what my students are struggling with so I can tailor my teaching for them."'
                imgPath="/zj_testimonials.jfif"
                name="Jane Zhang"
                position="Lecturer @ Republic Polytechnic"
              />
            </div>
          </div>
        </section>
        <section className="px-6 bg-purple-50">
          <div className="max-w-4xl 2xl:max-w-6xl mx-auto pt-20 pb-28">
            <h1 className="text-3xl sm:text-5xl font-bold text-center mb-16">
              Why EchoClass
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 justify-items-center">
              <Feature
                imgPath="/timer_lp.png"
                title={
                  <h3 className="text-xl sm:text-2xl font-semibold">
                    Setup a class in{" "}
                    <a className="text-purple-700 font-bold">17 seconds</a>.
                  </h3>
                }
                description="Spend your time investing in students, instead of setting up a piece of tech."
              />
              <Feature
                imgPath="/emojis_lp.png"
                title={
                  <h3 className="text-xl sm:text-2xl font-semibold">
                    Student Status
                  </h3>
                }
                description="Are my students following the lesson? Students can indicate their status with emojis."
              />
              <Feature
                imgPath="/tasks_lp.png"
                title={
                  <h3 className="text-xl sm:text-2xl font-semibold">
                    Receive Task Submissions
                  </h3>
                }
                description="Students can submit their work, while you can give grades and feedback — all in real-time"
              />
              <Feature
                imgPath="/ranking_lp.png"
                title={
                  <h3 className="text-xl sm:text-2xl font-semibold">
                    Rankings
                  </h3>
                }
                description="Give points to good submissions. Motivate students through gamification."
              />
            </div>
          </div>
        </section>
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;

const Testimonial = ({ quote, imgPath, name, position }) => {
  return (
    <div className="col-span-1 px-8 py-6 rounded-lg border">
      <p className="text-xl font-semibold">{quote}</p>
      <div className="flex flex-row gap-2 items-center mt-4">
        <img
          src={imgPath}
          className="rounded-full"
          height="35px"
          width="35px"
        />

        <div>
          <p className="text-lg">{name}</p>
          <p className="text-gray-500 text-sm">{position}</p>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ imgPath, title, description }) => {
  return (
    <div className="flex flex-col place-items-center gap-4">
      <img
        className="cols-span-1 text-center mb-4"
        src={imgPath}
        height="120px"
        width="120px"
      />
      {title}
      <p className="text-gray-500 text-center text-sm sm:text-base">
        {description}
      </p>
    </div>
  );
};
