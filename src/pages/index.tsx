import Head from "next/head";
import dynamic from "next/dynamic";
import styles from "./index.module.css";

// Import Globe component dynamically with SSR disabled
// This prevents errors with window/document not being available during server-side rendering
const Globe = dynamic(() => import("../components/Globe"), { ssr: false });

export default function Home() {
    return (
        <>
            <Head>
                <title>Branson Hackathon</title>
                <meta name="description" content="Branson Hackathon" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Fullscreen globe container */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                overflow: 'hidden'
            }}>
                <Globe />
            </div>

            {/* Title overlay */}
            <div style={{
                position: 'absolute',
                top: '2rem',
                left: 0,
                width: '100%',
                textAlign: 'center',
                zIndex: 10,
                pointerEvents: 'none'
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                }}>
                    BRANSON HACKATHON
                </h1>
            </div>
        </>
    );
}