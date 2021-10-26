import Head from 'next/head'
import Link from 'next/link'
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
    const { auth, setAuth } = useContext(AuthContext)

    const logout = () => {
        setAuth({...auth, loading: true})
        setAuth({ loading: false, isAuthenticated: false, tokens: null, userType: null })
        localStorage.removeItem('tokens')
        localStorage.removeItem('userType')
    }

    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
                <link href="https://fonts.googleapis.com/css2?family=Staatliches&display=swap" rel="stylesheet" />
                <link rel="icon" href="/e_favicon.ico" />
            </Head>
            <div className="bg-gray-100">
                <nav className="flex flex-row bg-white border-b-2 px-8 py-2 flex-wrap items-center justify-items-end">
                    <div><h1 className="text-2xl font-logo text-blue-700">EchoClass</h1></div>
                    { auth.userType === 'teacher' && (
                        <div><Link href='/teacher'>
                            <p className=" text-gray-500 hover:text-gray-700 px-12 cursor-pointer" >Classes</p>
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
