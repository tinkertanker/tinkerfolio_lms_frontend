import Head from "next/head";
import { useState } from "react";

const Testimonial = ({ text, imageUrl, name, title }) => {
  return (
    <div className="testimonial bg-gray-700 p-6 rounded-lg">
      <p className="text-xl font-semibold">{text}</p>
      <div className="flex items-center mt-4">
        <img src={imageUrl} className="rounded-full w-9 h-9" />
        <div className="ml-3">
          <p className="text-lg">{name}</p>
          <p className="text-gray-500 text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ imgPath, title, description }) => {
  return (
    <div className="text-center">
      <img src={imgPath} className="mx-auto mb-4 w-24" />
      {title}
      <p className="text-white">{description}</p>
    </div>
  );
};

const Home = () => {
  const [activeSection, setActiveSection] = useState(null);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Head>
        <title>Home | Tinkerfolio</title>
        <meta property="og:title" content="Tinkerfolio" />
        <meta
          property="og:description"
          content="Monitor your students' learning progress, receive task submissions, give feedback — in a fun and interactive way."
        />
        <meta name="twitter:title" content="Tinkerfolio" />
        <meta
          name="twitter:description"
          content="Monitor your students' learning progress, receive task submissions, give feedback — in a fun and interactive way."
        />
      </Head>

      <main>
        <section className="bg-gray-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto mt-10 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Tinkerfolio
              </h1>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="inline-block py-3 px-6 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="max-w-4xl 2xl:max-w-6xl mx-auto pt-20 pb-28">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 justify-items-center">
              <Feature
                imgPath="/timer_lp.png"
                title={
                  <h3 className="text-xl text-white sm:text-2xl font-semibold">
                    Setup a class in{" "}
                    <a className="text-red-600 font-bold">17 seconds</a>.
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
                description="Students can submit their work, while you can give grades and feedback — all in real-time."
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
    </div>
  );
};

export default Home;
