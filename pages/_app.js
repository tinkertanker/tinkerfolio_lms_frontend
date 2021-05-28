import Head from 'next/head'
import '../styles/globals.css'
import AuthContextProvider from "../contexts/Auth.Context"

function MyApp({ Component, pageProps }) {
    return (
        <AuthContextProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AuthContextProvider>
    )
}

export default MyApp

const Layout = ({children}) => {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
            </Head>
            <div>
                {children}
            </div>
        </>
    )
}
