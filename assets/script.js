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
		forecastTemp.classList = "card-body text-center p-1";
		forecastTemp.textContent = "Temp: " + ((dailyForecast.main.temp * 1.8) + 32).toFixed(2) + " °F";

		forcastDisplay.appendChild(forecastTemp);

		var forecastWind = document.createElement("span"); //creates element for displaying wind speed.
		forecastWind.classList = "card-body text-center p-1";
		forecastWind.textContent = "Wind: " + dailyForecast.wind.speed + "  MPH";

		forcastDisplay.appendChild(forecastWind);

		var forecastHumidity = document.createElement("span"); //creates element for displaying fiveday humidity.
		forecastHumidity.classList = "card-body text-center p-1";
		forecastHumidity.textContent = "Humidity: " + dailyForecast.main.humidity + " %";

		forcastDisplay.appendChild(forecastHumidity);
		forecastContainerEl.appendChild(forcastDisplay);

		console.log(forcastDisplay);
	}
}

cityForm.addEventListener("submit", formSubmit);  //added event listener to make buttons clickable.
