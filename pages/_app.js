import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useContext } from 'react'
import '../styles/globals.css'
import AuthContextProvider from "../contexts/Auth.Context"
import ClassroomsContextProvider from "../contexts/Classrooms.Context"
import PrivateRoute from "../utils/PrivateRoute"

import { AuthContext } from '../contexts/Auth.Context'

function MyApp({ Component, pageProps }) {
    return (
        <AuthContextProvider>
            <PrivateRoute>
                <ClassroomsContextProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ ClassroomsContextProvider>
            </ PrivateRoute>
        </ AuthContextProvider>
    )
}

export default MyApp

const Layout = ({children}) => {
    const router = useRouter()
    const { auth, setAuth } = useContext(AuthContext)

    const logout = () => {
        setAuth({...auth, loading: true})
        setAuth({ loading: false, isAuthenticated: false, tokens: null, userType: null })
        localStorage.removeItem('tokens')
        localStorage.removeItem('userType')
    }

    let navStyle = "bg-white border-b-2 px-8 py-2 flex flex-row items-center"
    if (router.pathname === "/") navStyle = "max-w-4xl 2xl:max-w-6xl mx-auto py-6 px-6 sm:px-0 bg-purple-50 flex flex-row items-center"
    if (router.pathname === "/login") navStyle = "bg-white border-b-2 px-6 py-2 flex flex-row items-center"
    if (router.pathname == "/join") navStyle = "hidden"
    if (router.pathname.includes('/teacher/')) navStyle = "fixed w-full bg-white px-8 py-2 flex flex-row items-center"
    return (
        <>
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Staatliches&display=swap" rel="stylesheet" />
                <link rel="icon" href="/e_favicon.ico" />

                <meta property='og:image' content='https://www.echoclass.com/logo.png'/>

                <meta name="twitter:card" content="summary" key="twitter_card" />
                <meta name="twitter:site" content="@themichaelchen" key="twitter_site" />
                <meta name="twitter:image" content="https://www.echoclass.com/logo.png" key="twitter_image" />

            </Head>
            <div className={(router.pathname === "/" ? "bg-purple-50" : "bg-gray-100")}>
                <nav className={navStyle}>
                    { ['/', '/login', 'join'].includes(router.pathname) ? (
                        <Link href="/">
                            <img className="cursor-pointer" src="logo.png" height="50px" width="50px"/>
                        </Link>
                    ) : (
                        <div><h1 className="text-2xl font-logo text-blue-700">EchoClass</h1></div>
                    )}

                    { (!auth.isAuthenticated) && (
                        <div className="flex flex-row-reverse items-center ml-auto gap-4 sm:gap-8">
                            <Link href='/login'>
                                <a className="px-4 py-0.5 border-2 border-blue-500 hover:border-blue-700 text-blue-500 hover:text-blue-700 text-lg rounded font-semibold">Login</a>
                            </Link>
                            <Link href='/join'>
                                <a className="text-gray-500 hover:text-gray-700">Join Code</a>
                            </Link>
                        </div>
                    )}
                    { auth.userType === 'teacher' && (
                        <div><Link href='/teacher'>
                            <p className="text-gray-500 hover:text-gray-700 px-6 sm:px-12 cursor-pointer" >Classes</p>
                        </Link></div>
                    )}
                    { auth.isAuthenticated &&
                        <div className="ml-auto">
                            <button onClick={logout} className="border-2 border-gray-300 text-sm text-gray-500 py-0.5 px-2 rounded hover:bg-gray-100">Logout</button>
                        </div>
                    }
                </nav>
                {children}
            </div>
        </>
    )
}
