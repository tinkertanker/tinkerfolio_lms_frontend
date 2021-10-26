import Head from 'next/head'
import Link from 'next/link'

const Home = () => {
  return (
    <div>
      <Head>
        <title>Home | EchoClass</title>
        <meta name="description" content="EchoClass is an open-source LMS." />
      </Head>

      <main className="pt-8 px-8 bg-white">
        <h1 className="text-5xl pb-4">Welcome to EchoClass!</h1>

        <Link href="/join"><button className="py-2 px-2 mb-4 bg-gray-500 rounded text-white">I am a student.</button></Link>
        <br />
        <Link href="/login"><button className="py-2 px-2 bg-gray-500 rounded text-white">I am a teacher.</button></Link>
      </main>

      <footer>
      </footer>
    </div>
  )
}

export default Home
