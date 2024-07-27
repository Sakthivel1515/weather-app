const cityField = document.querySelector(".js-city-input");
const searchBtn = document.querySelector(".js-search-btn");
const resultContainer = document.querySelector(".result-container");
const forecasts = document.querySelector(".forecasts");
const currentLocationBtn = document.querySelector(".current-location-btn");

const API_KEY = "a59287d1fc84e7b7d84181f56077b745";

// var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
// var iconurl = "http://openweathermap.org/img/w/" + iconcode + "@2x.png";


function createWeatherReport(cityName,forecastList) {
    const resultHtml = `<div class="result-forecast">
                    <h2>${cityName} <span class="no-wrap">(${forecastList[0].dt_txt.split(" ")[0]})</span></h2>
                    <p>Temperature : ${(Number(forecastList[0].main.temp) - 273.15).toFixed(2)}C</p>
                    <p>Wind : ${forecastList[0].wind.speed} M/S</p>
                    <p>Humidity : ${forecastList[0].main.humidity}%</p>
                  </div>
                  <div class="result-forecast-img-container">
                    <img src="http://openweathermap.org/img/w/${forecastList[0].weather[0].icon}.png" alt="weather-img">
                    <p>${forecastList[0].weather[0].description}</p>
                  </div>
                `
    resultContainer.innerHTML = resultHtml;

    
    forecasts.innerHTML = "";
    for (let i = 1; i < forecastList.length - 1;i++) {
        const forecastHtml = `<li class="forecast">
                            <p>${forecastList[i].dt_txt.split(" ")[0]}</p>
                            <img src="http://openweathermap.org/img/w/${forecastList[i].weather[0].icon}.png" alt="forecast-img">
                            <p>Temperature : ${(Number(forecastList[i].main.temp) - 273.15).toFixed(2)}C</p>
                            <p>Wind : ${forecastList[0].wind.speed} M/S</p>
                            <p>Humidity : ${forecastList[i].main.humidity}%</p>
                        </li>
                        `
        forecasts.insertAdjacentHTML("beforeend",forecastHtml);
    }
}

async function getWeatherDetails(lat,lon) {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
   
    const response = await fetch(WEATHER_API_URL);
    if (response.status !== 200 ) alert("Unexpected error occured while fetching weather details!");

    const data = await response.json();
    const uniqueDates = [];
    const forecastList = [];
    for (let forcast of data.list) {
        if (!uniqueDates.includes(new Date(forcast.dt_txt).getDate())){
            uniqueDates.push(new Date(forcast.dt_txt).getDate());
            forecastList.push(forcast);
        }
    }
    createWeatherReport(data.city.name,forecastList);
}

async function getCityCoordinates(city) {
    if (!city) {
        alert("Unexpected error occured enter the right city name");
        return
    }

    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
    if (response.status !== 200 ) alert("Unexpected error occured enter the right city name");
    
    const data = await response.json();
    if (data.length > 0 ) { 
        const {lat,lon} = data[0]; 
        getWeatherDetails(lat,lon);
    } else alert("Unexpected error occured enter the right city name")

}

currentLocationBtn.addEventListener("click", e => {
    navigator.geolocation.getCurrentPosition( position => {
        getWeatherDetails(position.coords.latitude,position.coords.longitude);
    }, error => alert("Allow current location to see weather or search your city"))
})

searchBtn.addEventListener("click", e => {
    let city = cityField.value.trim().toLowerCase();
    getCityCoordinates(city);
    cityField.value = ""
})
