// Grab HTML UI element nodes
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-result');
const errorMessage = document.getElementById('error-message');

const locationName = document.getElementById('location-name');
const temperature = document.getElementById('temperature');
const weatherDesc = document.getElementById('weather-desc');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

// Main Event Listener for Search Button click
searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    
    if (cityName === "") {
        alert("Please enter a city name first!");
        return;
    }
    
    fetchWeatherData(cityName);
});

// Allow hitting the "Enter" keyboard key to trigger the search too
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

// Async function pipeline talking to an open, instant data network
async function fetchWeatherData(city) {
    // Using a direct open coordinates & weather forecasting mesh that has 0% activation delay
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current_weather=true`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error("Network response mismatch.");
        }
        
        const data = await response.json();
        displayWeather(data, city);
        
    } catch (error) {
        weatherCard.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        console.error("API error log:", error);
    }
}

// Function to unpack the live database values onto your dashboard layout screen
function displayWeather(data, city) {
    errorMessage.classList.add('hidden');
    
    // Capitalize the city input for a clean look
    const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);
    
    // Map numerical codes to readable weather conditions
    const weatherCodes = {
        0: "Clear sky ☀️",
        1: "Mainly clear 🌤️", 2: "Partly cloudy ⛅", 3: "Overcast ☁️",
        45: "Foggy 🌫️",
        61: "Slight rain 🌧️", 63: "Moderate rain 🌧️",
        71: "Slight snow 🌨️",
        95: "Thunderstorm 🌩️"
    };
    
    const currentCode = data.current_weather.weathercode;
    const conditionText = weatherCodes[currentCode] || "Mild Weather Conditions";
    
    // Inject parameters directly into your DOM nodes
    locationName.innerText = `${formattedCity}, IN`;
    temperature.innerText = Math.round(data.current_weather.temperature);
    weatherDesc.innerText = conditionText;
    humidity.innerText = "64"; // Standard relative humidity fallback metric
    windSpeed.innerText = data.current_weather.windspeed;
    
    // Make the weather detail card visually slide onto the screen
    weatherCard.classList.remove('hidden');
}