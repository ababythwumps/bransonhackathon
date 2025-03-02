import { useState, useEffect } from "react";
import Head from "next/head";
import { fetchWeatherApi } from "openmeteo";
import Link from "next/link";
import styles from "../styles/SanFrancisco.module.css";

export default function NewYork() {
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
                latitude: 40.730610,
                longitude: -73.935242,
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
                document.getElementById("precipitation")!.innerHTML = String(Math.round(weatherData.daily.precipitation_sum[yearIndex] * 1000) / 1000);
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
                <title>New York Climate Forecast</title>
                <meta name="description" content="San Francisco climate projection through 2050" />
            </Head>
            
            <header className={styles.header}>
                <h1>NEW YORK, NY</h1>
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
                        <>
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

                            <div className={styles.climateVisualization}>
                                <h2>Climate Change Visualizations</h2>
                                <p>See the impact of climate change on New York as time progresses</p>
                                
                                <div className={styles.gifContainer}>
                                    <div className={styles.gifCard}>
                                        <h3>Sea Level Rise</h3>
                                        <div className={styles.gifWrapper}>
                                            <div className={styles.gifProgressBar} style={{ width: `${((sliderYear - 1950) / (2050 - 1950)) * 100}%` }}></div>
                                            <div className={styles.gifPlayer} id="seaLevelGif">
                                                <img 
                                                    src="/climate-gifs/sea-level-rise.gif" 
                                                    alt="Sea level rise over time" 
                                                    className={styles.climateGif}
                                                    style={{ 
                                                        opacity: 0.8,
                                                        filter: `contrast(${1 + (sliderYear - 1950) / 100}) brightness(${1 + (sliderYear - 1950) / 200})`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <p>New York City could experience sea level rise of up to 2.1 feet by 2050. Currently showing: {sliderYear}.</p>
                                    </div>

                                    <div className={styles.gifCard}>
                                        <h3>Urban Heat Island</h3>
                                        <div className={styles.gifWrapper}>
                                            <div className={styles.gifProgressBar} style={{ width: `${((sliderYear - 1950) / (2050 - 1950)) * 100}%` }}></div>
                                            <div className={styles.gifPlayer} id="droughtGif">
                                                <img 
                                                    src="/climate-gifs/drought-progression.gif" 
                                                    alt="Urban heat island effects" 
                                                    className={styles.climateGif}
                                                    style={{ 
                                                        opacity: 0.8,
                                                        filter: `sepia(${(sliderYear - 1950) / 100}) hue-rotate(${(sliderYear - 1950) / 10}deg)`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <p>NYC's urban heat island effect is expected to intensify with climate change. Year: {sliderYear}.</p>
                                    </div>

                                    <div className={styles.gifCard}>
                                        <h3>Arctic Ice Loss</h3>
                                        <div className={styles.gifWrapper}>
                                            <div className={styles.gifProgressBar} style={{ width: `${((sliderYear - 1950) / (2050 - 1950)) * 100}%` }}></div>
                                            <div className={styles.gifPlayer} id="arcticIceGif">
                                                <img 
                                                    src="/climate-gifs/arctic-ice-loss.gif" 
                                                    alt="Arctic ice loss progression" 
                                                    className={styles.climateGif}
                                                    style={{ 
                                                        opacity: 0.8,
                                                        filter: `brightness(${1 + (sliderYear - 1950) / 100}) blur(${(sliderYear - 1950) / 500}px)`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <p>Arctic sea ice is melting at an accelerating rate due to global warming. Year: {sliderYear}.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className={styles.noData}>No weather data available</p>
                    )}
                </section>
                
                <div className={styles.actionSection}>
                    <p>See how our actions today can impact New York's climate future.</p>
                    <Link href="/takeactionNY">
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