import Head from "next/head";
import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import styles from "./index.module.css";
import InfoPanel from "../components/InfoPanel";


const Globe = dynamic(() => import("../components/Globe"), { ssr: false });

export default function Home() {
    const [infoVisible, setInfoVisible] = useState(false);

    const toggleInfo = () => {
        setInfoVisible(!infoVisible);
    };

    return (
        <>
            <Head>
                <title>Climate Change Hackathon</title>
                <meta name="description" content="Branson Climate Change Hackathon" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Fullscreen globe container with click handler */}
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                    cursor: 'pointer'
                }}
                onClick={toggleInfo}
            >
                <Globe />
            </div>

            {/* Sepia overlay */}
            <div className="sepia-overlay"></div>

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
                    fontSize: '3.2rem',
                    fontWeight: 300,
                    color: '#f0e0b6',
                    textTransform: 'uppercase',
                    letterSpacing: '0.25em',
                    textShadow: '0 2px 15px rgba(0, 0, 0, 0.8)'
                }}>
                    CLIMATE CHANGE HACKATHON
                </h1>
                <p style={{
                    fontSize: '1.4rem',
                    fontWeight: 200,
                    color: '#d9b382',
                    marginTop: '1rem',
                    letterSpacing: '0.15em',
                    opacity: 0.85
                }}>
                    BRANSON · 2025
                </p>
            </div>

            {}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 20
            }}>
                <Link href="/SanFrancisco">
                    <button style={{
                        padding: '12px 24px',
                        backgroundColor: 'rgba(64, 44, 18, 0.7)',
                        color: '#f0e0b6',
                        border: '1px solid #d9b382',
                        borderRadius: '8px',
                        fontSize: '1.2rem',
                        fontFamily: 'CaskaydiaMono, monospace',
                        fontWeight: 300,
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(79, 54, 22, 0.85)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(64, 44, 18, 0.7)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    >
                        CHECK YOUR CITY
                    </button>
                </Link>
            </div>

            {}
            <InfoPanel isVisible={infoVisible} onClose={() => setInfoVisible(false)} />

            {}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: 0,
                width: '100%',
                textAlign: 'center',
                zIndex: 10
            }}>
                <p style={{
                    margin: 0,
                    fontSize: '1.2rem',
                    fontWeight: 200,
                    color: '#d9b382',
                    letterSpacing: '0.1em',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
                    pointerEvents: 'none'
                }}>
                    CODING FOR A SUSTAINABLE FUTURE
                </p>
                <p style={{
                    margin: '0.8rem 0 0 0',
                    fontSize: '0.9rem',
                    color: '#d9b382',
                    opacity: 0.7,
                    fontStyle: 'italic',
                    pointerEvents: 'none'
                }}>
                    clici globe
                </p>
            </div>
        </>
    );
}