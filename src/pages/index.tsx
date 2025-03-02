import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import { findNearestCity } from "../data/cities";

// Import Globe component dynamically with SSR disabled
const Globe = dynamic(() => import("../components/Globe"), { ssr: false });

export default function Home() {
    const router = useRouter();
    
    const handleFindNearestCity = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    try {
                        // Find the nearest city with population over 50,000
                        const nearestCity = findNearestCity(
                            position.coords.latitude,
                            position.coords.longitude,
                            50000
                        );
                        
                        // Navigate to the nearest city page
                        router.push(`/${nearestCity.slug}`);
                    } catch (error) {
                        console.error("Error finding nearest city:", error);
                        // Fallback to San Francisco if there's an error
                        alert("Unable to find nearest city. Redirecting to San Francisco.");
                        router.push("/SanFrancisco");
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    alert("Unable to get your location. Redirecting to San Francisco instead.");
                    router.push("/SanFrancisco");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser. Redirecting to San Francisco instead.");
            router.push("/SanFrancisco");
        }
    };
    
    return (
        <>
            <Head>
                <title>Climate Change Hackathon</title>
                <meta name="description" content="Branson Climate Change Hackathon" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Fullscreen globe container */}
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden'
                }}
            >
                <Globe />
            </div>

            {/* Black & White overlay */}
            <div className="bw-overlay"></div>

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
                    fontWeight: 200,
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.25em',
                    textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)'
                }}>
                    CLIMATE CHANGE HACKATHON
                </h1>
                <p style={{
                    fontSize: '1.4rem',
                    fontWeight: 200,
                    color: '#eeeeee',
                    marginTop: '1rem',
                    letterSpacing: '0.15em',
                    opacity: 0.85
                }}>
                    BRANSON · 2025
                </p>
            </div>

            {/* Footer with tagline and button */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: 0,
                width: '100%',
                textAlign: 'center',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                <div>
                    <p style={{
                        margin: 0,
                        fontSize: '1.2rem',
                        fontWeight: 200,
                        color: '#ffffff',
                        letterSpacing: '0.1em',
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                        pointerEvents: 'none'
                    }}>
                        CODING FOR A SUSTAINABLE FUTURE
                    </p>
                    <p style={{
                        margin: '0.8rem 0 0 0',
                        fontSize: '0.9rem',
                        color: '#cccccc',
                        opacity: 0.8,
                        fontStyle: 'italic',
                        pointerEvents: 'none'
                    }}>
                        Click the globe for climate data
                    </p>
                </div>
                
                {/* City Buttons */}
                <div style={{ 
                    display: 'flex', 
                    gap: '1rem',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {/* San Francisco Button */}
                    <Link href="/SanFrancisco">
                        <button style={{
                            padding: '12px 24px',
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            border: '1px solid #ffffff',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            fontFamily: 'CaskaydiaMono, monospace',
                            fontWeight: 200,
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.3s ease',
                            width: '280px',
                            textAlign: 'center'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        >
                            SAN FRANCISCO
                        </button>
                    </Link>

                    {/* Find Nearest City Button */}
                    <button 
                        onClick={handleFindNearestCity}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            border: '1px solid #ffffff',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            fontFamily: 'CaskaydiaMono, monospace',
                            fontWeight: 200,
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.3s ease',
                            width: '280px',
                            textAlign: 'center'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        FIND NEAREST CITY
                    </button>
                </div>
            </div>
        </>
    );
}