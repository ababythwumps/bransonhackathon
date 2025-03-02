import { useState, useEffect } from "react";
import Head from "next/head";
import { fetchWeatherApi } from "openmeteo";
import Link from "next/link"
export default function SanFrancisco() {
    // State to hold weather data
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const [sliderYear, setSliderYear] = useState(1950);

    // Helper function to create time ranges
    const range = (start, stop, step) =>
        Array.from({ length: Math.floor((stop - start) / step) }, (_, i) => start + i * step);

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
                const response = responses[0];

                const utcOffsetSeconds = response.utcOffsetSeconds();
                const daily = response.daily();
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

                setWeatherData(weather);
            } catch (err) {
                console.error("Error fetching weather data:", err);
                setError("Failed to load weather data.");
            }
        }

        fetchData();
    }, []);

    // Handle slider change
    let yearIndex = 0
    const handleSliderChange = (event) => {
        const year = parseInt(event.target.value);
        setSliderYear(year);

        if (weatherData) {
            try {
                yearIndex = weatherData.daily.time.findIndex(date => date.getFullYear() === year);
                console.log(`Temperature for ${year}: ${weatherData.daily.temperature2mMax[yearIndex]}`);
                document.getElementById("temperature").innerHTML = String(Math.round(weatherData.daily.temperature2mMax[yearIndex] * 10) / 10);
                document.getElementById("precipitation").innerHTML = String(weatherData.daily.precipitation_sum[yearIndex]);
            } catch (err) {
                console.error("Error processing data for selected year:", err);
            }
        }
    };

    return (
        <>
            <Head>
                <title>SAN FRANCISCO, CA, USA</title>
            </Head>
            <main>
                <h1>SAN FRANCISCO, CA, USA</h1>

                <div>
                    <input
                        type="range"
                        min="1950"
                        max="2050"
                        value={sliderYear}
                        onChange={handleSliderChange}
                        className="slider"
                    />
                    <div>Current Year: {sliderYear}</div>
                </div>

                {error && <p style={{color: "red"}}>{error}</p>}
                {weatherData ? (
                    <div>
                        {weatherData.daily.time.length > 0 ? (
                            <div>
                                <div id="temperature">
                                    {/*<strong>{weatherData.daily.time[0].toISOString()}</strong>:{" "}*/}
                                    {weatherData.daily.temperature2mMax[yearIndex]}
                                </div>

                                <div id="precipitation">
                                    {weatherData.daily.precipitation_sum[yearIndex]}
                                </div>
                            </div>
                        ) : (
                            <p>No weather data available</p>
                        )}
                    </div>
                ) : (
                    <p>Loading weather data...</p>
                )}
            </main>
        </>
    );
}