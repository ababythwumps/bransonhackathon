import { useState, useEffect } from "react";
import Head from "next/head";
import { fetchWeatherApi } from "openmeteo";

export default function SanFrancisco() {
    // State to hold weather data
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

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
                daily: "temperature_2m_max"
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
                        temperature2mMax: daily.variables(0)?.valuesArray() || []
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

    const tempSlider = document.createElement("div");
    tempSlider.className = "slidecontainer";

    return (
        <>
            <Head>
                <title>San Francisco Weather</title>
            </Head>
            <main>
                <h1>San Francisco</h1>
                {error && <p style={{color: "red"}}>{error}</p>}
                {weatherData ? (
                    <div>
                        {weatherData.daily.time.length > 0 ? (
                            <div>
                                <strong>{weatherData.daily.time[0].toISOString()}</strong>:{" "}
                                {weatherData.daily.temperature2mMax[0]}
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
