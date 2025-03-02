import { useState, useEffect, ChangeEvent } from "react";
import Head from "next/head";
import { fetchWeatherApi } from "openmeteo";
import Link from "next/link";
import styles from "../styles/SanFrancisco.module.css";

// Define types for the weather data structure
interface WeatherDaily {
  time: Date[];
  temperature2mMax: Float32Array;
  precipitation_sum: Float32Array;
}

interface WeatherData {
  daily: WeatherDaily;
}

export default function SanFrancisco() {
    // State to hold weather data with proper types
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
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
                
                if (responses && responses.length > 0) {
                    const response = responses[0];
                    
                    if (response) {
                        const utcOffsetSeconds = response.utcOffsetSeconds();
                        const daily = response.daily();
                        if (!daily) {
                            throw new Error("No daily weather data available");
                        }

                        // Create a simple structure with arrays for datetime and weather data.
                        const weather: WeatherData = {
                            daily: {
                                time: range(
                                    Number(daily.time()),
                                    Number(daily.timeEnd()),
                                    daily.interval()
                                ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
                                temperature2mMax: daily.variables(0)?.valuesArray() || new Float32Array(),
                                precipitation_sum: daily.variables(1)?.valuesArray() || new Float32Array()
                            }
                        };

                        setWeatherData(weather);
                        setLoading(false);
                    } else {
                        throw new Error("Invalid response format");
                    }
                } else {
                    throw new Error("No response received");
                }
            } catch (err) {
                console.error("Error fetching weather data:", err);
                setError("Failed to load weather data.");
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Handle slider change
    let yearIndex = 0;
    const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
        const year = parseInt(event.target.value);
        setSliderYear(year);

        if (weatherData) {
            try {
                yearIndex = weatherData.daily.time.findIndex(date => date.getFullYear() === year);
                
                // Update the temperature and precipitation displays
                if (yearIndex !== -1) {
                    const temperatureElement = document.getElementById("temperature");
                    const precipitationElement = document.getElementById("precipitation");
                    
                    if (temperatureElement && weatherData.daily.temperature2mMax[yearIndex] !== undefined) {
                        const tempValue = weatherData.daily.temperature2mMax[yearIndex] as number;
                        temperatureElement.innerHTML = String(Math.round(tempValue * 10) / 10);
                    }
                    if (precipitationElement && weatherData.daily.precipitation_sum[yearIndex] !== undefined) {
                        const precipValue = weatherData.daily.precipitation_sum[yearIndex] as number;
                        precipitationElement.innerHTML = String(precipValue);
                    }
                }
                
                // Calculate percentage for GIF control
                const percentage = (year - 1950) / (2050 - 1950);
                
                // Control GIFs based on year slider
                updateGifEffects(percentage, year);
                
                // Additional visual feedback for the slider movement
                const slider = document.querySelector(`.${styles.yearSlider}`) as HTMLElement | null;
                if (slider) {
                    // Apply a subtle pulse effect on change
                    slider.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
                    setTimeout(() => {
                        slider.style.boxShadow = 'none';
                    }, 300);
                }
            } catch (err) {
                console.error("Error processing data for selected year:", err);
            }
        }
    };

    // Function to determine temperature-based color
    const getTemperatureColor = (temp: number | undefined | null) => {
        if (temp === undefined || temp === null) return '#FFFFFF';
        if (temp > 90) return '#FF3D00';
        if (temp > 80) return '#FF9100';
        if (temp > 70) return '#FFEA00';
        if (temp > 60) return '#76FF03';
        if (temp > 50) return '#00E5FF';
        return '#2979FF';
    };

    // Function to update GIF visual effects based on year
    const updateGifEffects = (percentage: number, year: number) => {
        try {
            // Sea Level GIF
            const seaLevelGif = document.querySelector('#seaLevelGif img') as HTMLImageElement | null;
            if (seaLevelGif) {
                // Increase contrast and brightness as years progress
                const contrast = 1 + percentage * 1;  // 1 to 2
                const brightness = 1 + percentage * 0.5;  // 1 to 1.5
                seaLevelGif.style.filter = `contrast(${contrast}) brightness(${brightness})`;
                
                // Adjust position to simulate rising water
                const riseAmount = percentage * 30; // px to move up
                seaLevelGif.style.transform = `translateY(${-riseAmount}px)`;
            }
            
            // Drought GIF
            const droughtGif = document.querySelector('#droughtGif img') as HTMLImageElement | null;
            if (droughtGif) {
                // Add sepia and change hue to simulate drying/browning
                const sepia = percentage;  // 0 to 1
                const hueRotate = percentage * 30;  // 0 to 30 degrees
                droughtGif.style.filter = `sepia(${sepia}) hue-rotate(${hueRotate}deg)`;
            }
            
            // Wildfire GIF
            const wildfireGif = document.querySelector('#wildfireGif img') as HTMLImageElement | null;
            if (wildfireGif) {
                // Increase saturation and contrast for more intense fire
                const saturate = 1 + percentage * 2;  // 1 to 3
                const contrast = 1 + percentage;  // 1 to 2
                wildfireGif.style.filter = `saturate(${saturate}) contrast(${contrast})`;
                
                // Add a subtle red overlay as time progresses
                const redOverlay = percentage * 0.3;  // 0 to 0.3
                wildfireGif.style.boxShadow = `inset 0 0 50px rgba(255, 0, 0, ${redOverlay})`;
            }
        } catch (err) {
            console.error("Error updating GIF effects:", err);
        }
    };
    
    // Calculate the temperature and precipitation for the current year
    const currentTempRaw = weatherData?.daily?.temperature2mMax?.[yearIndex];
    // Ensure currentTemp is either a number or undefined, not any other type
    const currentTemp: number | undefined = typeof currentTempRaw === 'number' ? currentTempRaw : undefined;
    const currentPrecip = weatherData?.daily?.precipitation_sum?.[yearIndex];
    // Use non-null assertion since we've already handled the undefined case in getTemperatureColor
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
                        <>
                        <div className={styles.weatherDisplay}>
                            <div className={styles.weatherCard} style={{ borderColor: tempColor }}>
                                <h2>Maximum Temperature</h2>
                                <div className={styles.dataValue} style={{ color: tempColor }}>
                                    <span id="temperature">
                                        {Math.round(currentTemp * 10) / 10}
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
                            <p>See the impact of climate change on San Francisco as time progresses</p>
                            
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
                                    <p>Sea levels in the Bay Area could rise by up to 1.9 feet by 2050. Currently showing: {sliderYear}.</p>
                                </div>

                                <div className={styles.gifCard}>
                                    <h3>Drought Conditions</h3>
                                    <div className={styles.gifWrapper}>
                                        <div className={styles.gifProgressBar} style={{ width: `${((sliderYear - 1950) / (2050 - 1950)) * 100}%` }}></div>
                                        <div className={styles.gifPlayer} id="droughtGif">
                                            <img 
                                                src="/climate-gifs/drought-progression.gif" 
                                                alt="Drought progression" 
                                                className={styles.climateGif}
                                                style={{ 
                                                    opacity: 0.8,
                                                    filter: `sepia(${(sliderYear - 1950) / 100}) hue-rotate(${(sliderYear - 1950) / 10}deg)`
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <p>California is expected to face increasing drought severity as climate change continues. Year: {sliderYear}.</p>
                                </div>

                                <div className={styles.gifCard}>
                                    <h3>Wildfire Risk</h3>
                                    <div className={styles.gifWrapper}>
                                        <div className={styles.gifProgressBar} style={{ width: `${((sliderYear - 1950) / (2050 - 1950)) * 100}%` }}></div>
                                        <div className={styles.gifPlayer} id="wildfireGif">
                                            <img 
                                                src="/climate-gifs/wildfire-progression.gif" 
                                                alt="Wildfire risk progression" 
                                                className={styles.climateGif}
                                                style={{ 
                                                    opacity: 0.8,
                                                    filter: `saturate(${1 + (sliderYear - 1950) / 50}) contrast(${1 + (sliderYear - 1950) / 100})`
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <p>Wildfire frequency and intensity are projected to increase with higher temperatures. Year: {sliderYear}.</p>
                                </div>
                            </div>
                        </div>
                        </>
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