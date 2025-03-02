import { useState, useEffect } from "react";
import Head from "next/head";
import { fetchWeatherApi } from "openmeteo";
import Link from "next/link";
import styles from "../styles/SanFrancisco.module.css";

export default function SanFrancisco() {
    // State to hold weather data
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const [sliderYear, setSliderYear] = useState(1950);
    const [loading, setLoading] = useState(true);

    // Helper function to create time ranges
    const range = (start: number, stop: number, step: number) => Array.from({ length: Math.floor((stop - start) / step) }, (_, i) => start + i * step);

    useEffect(() => {
        async function fetchData() {
            const params = {
                latitude: 37.7749,
                longitude: -122.4194,
                start_date: "1950-01-01",
                end_date: "2050-12-31",
                models: [
                    "CMCC_CM2_VHR4",
                    "FGOALS_f3_H",
                    "HiRAM_SIT_HR",
                    "MRI_AGCM3_2_S",
                    "EC_Earth3P_HR",
                    "MPI_ESM1_2_XR",
                    "NICAM16_8S"
                ],
                temperature_unit: "fahrenheit",
                precipitation_unit: "inch",
                daily: ["temperature_2m_max", "precipitation_sum"]
            };

            const url = "https://climate-api.open-meteo.com/v1/climate";
            try {
                const responses = await fetchWeatherApi(url, params);
                let response = responses[0];

                const utcOffsetSeconds: number = response!.utcOffsetSeconds();
                const daily = response!.daily();
                if (!daily) {
                    throw new Error("No daily weather data available");
                }

                // Create a simple structure with arrays for datetime and weather data.
                const weather = {
                    daily: {
                        time: range(
                            Number(daily.time()),
                            Number(daily.timeEnd()),
                            daily.interval()
                        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
                        temperature2mMax: daily.variables(0)?.valuesArray() || [],
                        precipitation_sum: daily.variables(1)?.valuesArray() || []
                    }
                };

                // @ts-ignore
                setWeatherData(weather);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching weather data:", err);
                // @ts-ignore
                setError("Failed to load weather data.");
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Handle slider change
    let yearIndex = 0;
    const handleSliderChange = (event: { target: { value: string; }; }) => {
        const year = parseInt(event.target.value);
        setSliderYear(year);

        if (weatherData) {
            try {
                // @ts-ignore
                yearIndex = weatherData.daily.time.findIndex(date => date.getFullYear() === year);
                // @ts-ignore
                console.log(`Temperature for ${year}: ${weatherData.daily.temperature2mMax[yearIndex]}`);
                // @ts-ignore
                document.getElementById("temperature")!.innerHTML = String(Math.round(weatherData.daily.temperature2mMax[yearIndex] * 10) / 10);
                // @ts-ignore
                document.getElementById("precipitation")!.innerHTML = String(weatherData.daily.precipitation_sum[yearIndex]);
            } catch (err) {
                console.error("Error processing data for selected year:", err);
            }
        }
    };

    // Function to determine temperature-based color
    const getTemperatureColor = (temp: number) => {
        if (!temp) return '#FFFFFF';
        if (temp > 90) return '#FF3D00';
        if (temp > 80) return '#FF9100';
        if (temp > 70) return '#FFEA00';
        if (temp > 60) return '#76FF03';
        if (temp > 50) return '#00E5FF';
        return '#2979FF';
    };

    // Calculate the temperature and precipitation for the current year
    // @ts-ignore
    const currentTemp = Math.round(weatherData?.daily?.temperature2mMax[yearIndex] * 10) / 10;
    // @ts-ignore
    const currentPrecip = String(Math.round(weatherData?.daily?.precipitation_sum[yearIndex] * 1000) / 1000);
    const tempColor = getTemperatureColor(currentTemp);
    return (
        <div className={styles.container}>
            <Head>
                <title>San Francisco Climate Forecast</title>
                <meta name="description" content="San Francisco climate projection through 2050" />
            </Head>
            
            <header className={styles.header}>
                <h1>SAN FRANCISCO, CA</h1>
                <p className={styles.subtitle}>Climate Projection through 2050</p>
            </header>

            <main className={styles.main}>
                <div className={styles.cityImageContainer}>
                    <div 
                        className={styles.cityImage} 
                        style={{ 
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('/sf-skyline.jpg')`
                        }}
                    />
                </div>
                
                <section className={styles.dataSection}>
                    <div className={styles.sliderContainer}>
                        <h3>Move the slider to see climate projections by year</h3>
                        <div className={styles.sliderWrapper}>
                            <span>1950</span>
                            <input
                                type="range"
                                min="1950"
                                max="2050"
                                value={sliderYear}
                                onChange={handleSliderChange}
                                className={styles.yearSlider}
                            />
                            <span>2050</span>
                        </div>
                        <div className={styles.currentYear}>
                            <span>Current Year: </span>
                            <span className={styles.yearValue}>{sliderYear}</span>
                        </div>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}
                    
                    {loading ? (
                        <div className={styles.loading}>
                            <p>Loading climate data...</p>
                            <div className={styles.spinner}></div>
                        </div>
                    ) : weatherData ? (
                        <div className={styles.weatherDisplay}>
                            <div className={styles.weatherCard} style={{ borderColor: tempColor }}>
                                <h2>Maximum Temperature</h2>
                                <div className={styles.dataValue} style={{ color: tempColor }}>
                                    <span id="temperature">
                                        {currentTemp}
                                    </span>
                                    <span className={styles.unit}>°F</span>
                                </div>
                            </div>

                            <div className={styles.weatherCard}>
                                <h2>Precipitation</h2>
                                <div className={styles.dataValue}>
                                    <span id="precipitation">
                                        {currentPrecip}
                                    </span>
                                    <span className={styles.unit}>in</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className={styles.noData}>No weather data available</p>
                    )}
                </section>
                
                <div className={styles.actionSection}>
                    <p>See how our actions today can impact San Francisco's climate future.</p>
                    <Link href="/takeaction">
                        <button className={styles.actionButton}>
                            Take Action Now
                        </button>
                    </Link>
                </div>
            </main>
        </div>
    );
}

//Comment for vercel