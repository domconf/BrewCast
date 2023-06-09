const form = document.querySelector('form');
const tableBody = document.getElementById('brewery-data');

form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const city = event.target.elements.city.value;
	const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${city}&per_page=10`);

	if (response.ok) {
		const breweries = await response.json();

		tableBody.innerHTML = '';

		breweries.forEach((brewery) => {
			const row = document.createElement('tr');

			row.innerHTML = `
						<td>${brewery.name}</td>
						<td>${brewery.brewery_type}</td>
						<td>${brewery.street}, ${brewery.address_2 || ''}, ${brewery.address_3 || ''}</td>
						<td>${brewery.city}</td>
						<td>${brewery.state_province}</td>
						<td>${brewery.postal_code}</td>
						<td>${brewery.country}</td>
						<td>${brewery.phone || ''}</td>
						<td>${brewery.website_url || ''}</td>
					`;

			tableBody.appendChild(row);
		});
	}
});

var $cityList = [];

var cityForm = document.querySelector("#search-form");
var cityInput = document.querySelector("#city");
var weatherEl = document.querySelector("#current-weather-container");
//var citySearch = document.querySelector("#searched-city");
var weatherTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
//var pastCityEl = document.querySelector("#past-search-buttons");

var formSubmit = function (event) {
	event.preventDefault();  //prevents parent/child elements from receiving an event.
	var city = cityInput.value.trim(); //removes empty spaces before and after the user's input city string.
	if (city) {
		//weatherStat(city);
		fiveDay(city);
		$cityList.unshift({ city }); //unshift adds the entered city to the beginning of the array of previously-searched cities.
		cityInput.value = ""; //clears input field after city is submitted.
	} else {
		alert("Please enter a City"); //if nothing was input.
	}
	//console.log(city);
}

var weatherStat = function (city) {
	var apiKey = "8d3e692b829897d448120b0afbe8270a"
	var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

	fetch(apiURL).then(function (response) {

		response.json().then(function (data) { //acquires weather data from URL for display.
			renderWeather(data, city);

		});
	});
};

var fiveDay = function (city) {  //sets up the fiveday forecast panel.
	var apiKey = "8d3e692b829897d448120b0afbe8270a"
	var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`

	fetch(apiURL).then(function (response) {

		response.json().then(function (data) {
			renderFiveDay(data);
		});
	});
};

var renderFiveDay = function (weather) {
	forecastContainerEl.textContent = ""
	weatherTitle.textContent = "5-Day Forecast:";

	var forecast = weather.list;
	for (var i = 3; i < forecast.length; i = i + 8) { //acquires the list of weather conditions starting at noon of each day for 5 days.
		var dailyForecast = forecast[i];

		var forcastDisplay = document.createElement("div");
		forcastDisplay.classList = "card bg-dark text-light m-3 "; //sets the forecast as a card display.

		var weatherDate = document.createElement("h5") //Displays each date for all five days.
		weatherDate.textContent = moment.unix(dailyForecast.dt).format("M/DD/YYYY");
		weatherDate.classList = "text-center"
		forcastDisplay.appendChild(weatherDate);

		var weatherImage = document.createElement("img") //Creates weather icon.
		weatherImage.classList = "card-body text-center";
		weatherImage.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

		forcastDisplay.appendChild(weatherImage);

		var forecastTemp = document.createElement("span");  //creates element for displaying fiveday temperature.
		forecastTemp.classList = "card-body";
		if (dailyForecast.main.temp <= 0) {
			forecastTemp.textContent = "Temp: Freezing!"
		} else if (dailyForecast.main.temp > 0 && dailyForecast.main.temp <= 16) {
			forecastTemp.textContent = "Temp: Cold"
		} else if (dailyForecast.main.temp > 16 && dailyForecast.main.temp <= 22) {
			forecastTemp.textContent = "Temp: Chilly"
		} else if (dailyForecast.main.temp > 22 && dailyForecast.main.temp <= 30) {
			forecastTemp.textContent = "Temp: Nice"
		} else if (dailyForecast.main.temp > 30 && dailyForecast.main.temp <= 32) {
			forecastTemp.textContent = "Temp: Warm"
		} else if (dailyForecast.main.temp > 32) {
			forecastTemp.textContent = "Temp: Hot!"
		}
		//forecastTemp.textContent = "Temp: " + ((dailyForecast.main.temp * 1.8) + 32).toFixed(2) + " °F";
		forcastDisplay.appendChild(forecastTemp);
		var forecastWind = document.createElement("span"); //creates element for displaying wind speed.
		forecastWind.classList = "card-body";
		if (dailyForecast.wind.speed >= 0 && dailyForecast.wind.speed < 25) {
			forecastWind.textContent = "Wind: Breezy"
		} else if (dailyForecast.wind.speed >= 25 && dailyForecast.wind.speed < 50) {
			forecastWind.textContent = "Wind: Windy"
		} else if (dailyForecast.wind.speed > 50) {
			forecastWind.textContent = "Wind: Storm Winds!"
		}
		//forecastWind.textContent = "Wind: " + dailyForecast.wind.speed + "  MPH";
		forcastDisplay.appendChild(forecastWind);
		var forecastHeat = document.createElement("span"); //creates element for displaying fiveday heat index.
		forecastHeat.classList = "card-body";
		if (dailyForecast.main.humidity > 10 && dailyForecast.main.humidity <= 80 && dailyForecast.main.temp >= 27 && dailyForecast.main.temp < 32) {
			forecastHeat.textContent = "Advice: Moderate Heat"
		} else if (dailyForecast.main.humidity > 10 && dailyForecast.main.humidity <= 90 && dailyForecast.main.temp >= 32 && dailyForecast.main.temp < 38) {
			forecastHeat.textContent = "Advice: Risk of Heatstroke"
		} else if (dailyForecast.main.humidity > 10 && dailyForecast.main.humidity <= 90 && dailyForecast.main.temp >= 38) {
			forecastHeat.textContent = "Advice: Stay Inside!"
		} else {
			forecastHeat.textContent = "Advice: Safe Outside"
		}
		//forecastHeat.textContent = "Heat Index: " + dailyForecast.main.humidity + " %";
		forcastDisplay.appendChild(forecastHeat);
		forecastContainerEl.appendChild(forcastDisplay);
	}
}
cityForm.addEventListener("submit", formSubmit);  //added event listener to make buttons clickable.