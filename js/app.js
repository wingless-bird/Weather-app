const apiKey = "1e3e8f230b6064d27976e41163a82b77";

document.addEventListener("DOMContentLoaded", () => {

    const searchBtn = document.querySelector(".search-btn");
    const searchInput = document.querySelector(".searchinput");

    // Search Page
    if (searchBtn && searchInput) {

        searchBtn.addEventListener("click", () => {
            searchWeather(searchInput.value.trim());
        });

        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                searchWeather(searchInput.value.trim());
            }
        });

    }

    // Home Page
    if (document.getElementById("city-name") && !searchBtn) {
        loadCurrentLocation();
    }

});



/*=============================
      WEATHER IMAGE
==============================*/

function getWeatherImage(condition) {

    switch (condition) {

        case "Clear":
            return "img/sun.png";

        case "Clouds":
        case "Smoke":
            return "img/cloud.png";

        case "Rain":
        case "Drizzle":
            return "img/rain.png";

        case "Snow":
            return "img/snow.png";

        case "Mist":
        case "Fog":
            return "img/mist.png";

        case "Thunderstorm":
            return "img/thunderstorm.png";

        case "Haze":
            return "img/haze.png";

        default:
            return "img/cloud.png";
    }

}



/*=============================
      SEARCH WEATHER
==============================*/

async function searchWeather(city) {

    if (!city) {
        alert("Please enter city name.");
        return;
    }

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        updateSearchUI(data);

        // Load forecast without waiting
        fetchForecast(city);

    }

    catch (error) {

        console.log(error);
        alert("Unable to fetch weather.");

    }

}



/*=============================
      SEARCH UI
==============================*/

function updateSearchUI(data) {

    document.querySelector(".city-name").innerHTML = data.name;

    document.querySelector(".weather-temp").innerHTML =
        Math.round(data.main.temp) + "°";

    document.querySelector(".feels-like").innerHTML =
        Math.round(data.main.feels_like) + "°";

    document.querySelector(".wind").innerHTML =
        Math.round(data.wind.speed) + " m/s";

    document.querySelector(".condition").innerHTML =
        data.weather[0].main;

    document.querySelector(".weather-img").src =
        getWeatherImage(data.weather[0].main);

    document.querySelector(".sunrise").innerHTML =
        new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    document.querySelector(".sunset").innerHTML =
        new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

}



/*=============================
      CURRENT LOCATION
==============================*/

function loadCurrentLocation() {

    navigator.geolocation.getCurrentPosition(

        async function (position) {

            try {

                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
                );

                const data = await response.json();

                if (!response.ok) {
                    window.location.href = "search.html";
                    return;
                }

                updateHomeUI(data);

                fetchForecast(data.name);

            }

            catch (error) {

                console.log(error);
                window.location.href = "search.html";

            }

        },

        function () {

            window.location.href = "search.html";

        }

    );

}



/*=============================
        HOME UI
==============================*/

function updateHomeUI(data) {

    document.getElementById("city-name").innerHTML = data.name;

    document.getElementById("metric").innerHTML =
        Math.round(data.main.temp) + "°";

    document.getElementById("weather-main").innerHTML =
        data.weather[0].main;

    document.getElementById("weather-icon").src =
        getWeatherImage(data.weather[0].main);

    document.getElementById("temp-main").innerHTML =
        Math.round(data.main.temp) + "°";

    document.getElementById("temp-feels").innerHTML =
        Math.round(data.main.feels_like) + "°";

    document.getElementById("humidity").innerHTML =
        data.main.humidity + "%";

    document.getElementById("wind").innerHTML =
        Math.round(data.wind.speed) + " m/s";

    document.getElementById("sunrise").innerHTML =
        new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    document.getElementById("sunset").innerHTML =
        new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

}



/*=============================
        FORECAST
==============================*/

async function fetchForecast(city) {

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );

        const data = await response.json();

        if (!response.ok) return;

        displayForecast(data);

    }

    catch (error) {

        console.log(error);

    }

}



/*=============================
      DISPLAY FORECAST
==============================*/

function displayForecast(data) {

    let container =
        document.getElementById("future-forecast-box") ||
        document.getElementById("search-forecast");

    if (!container) return;

    container.innerHTML = "";

    const usedDays = new Set();

    data.list.forEach(item => {

        const date = item.dt_txt.split(" ")[0];

        if (!usedDays.has(date) && usedDays.size < 5) {

            usedDays.add(date);

            container.innerHTML += `

            <div class="forecast-item">

                <h4>
                    ${new Date(date).toLocaleDateString("en-US", {
                        weekday: "short"
                    })}
                </h4>

                <img
                    src="${getWeatherImage(item.weather[0].main)}"
                    width="45"
                >

                <p>${Math.round(item.main.temp)}°</p>

            </div>

            `;

        }

    });

}