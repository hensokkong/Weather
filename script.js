const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.btn-search');
const key = "1342e387a5f510156c6b8bddebc88348";

const sectionNotFound = document.querySelector('.not-found');
const weatherInfoSection = document.querySelector('.weather-info');
const searchCitySection = document.querySelector('.search-message');

//display text 
const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValue = document.querySelector('.humidity-value-txt');
const windValue = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-cloud-img');
const currentDate = document.querySelector('.current-date-txt');
const forecastItemContainer = document.querySelector('.forcast-item-container');


searchBtn.addEventListener('click', () => {
  if (cityInput.value.trim() != '') {
    updateWeatherInfo(cityInput.value);
    cityInput.value = '';
    cityInput.blur();
  }
})

cityInput.addEventListener('keydown', (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != '') {
    updateWeatherInfo(cityInput.value);
    cityInput.value = '';
    cityInput.blur();
  }
})
//call api
async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=1342e387a5f510156c6b8bddebc88348`;
  const response = await fetch(apiUrl);
  return response.json();
}
function getWeatherIcon(id) {
  if (id <= 232) return 'thunderstorm.svg';
  if (id <= 321) return 'drizzle.svg';
  if (id <= 531) return 'rain.svg';
  if (id <= 622) return 'snow.svg';
  if (id <= 781) return 'atmosphere.svg';
  if (id <= 800) return 'clear.svg';
  else return 'clouds.svg';
}

function getCurrentDate() {
  const currentDate = new Date();
  const option = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',

  }
  return currentDate.toLocaleDateString('en-GB', option);
}
async function updateWeatherInfo(city) {
  const weatherData = await getFetchData('weather', city);
  if (weatherData.cod != 200) {
    showDisplaySection(sectionNotFound);
    return;
  }
  const {
    name: country,
    main: { temp, humidity },
    weather: { id, main },
    wind: { speed }
  } = weatherData
  forecastItemContainer.innerHTML = '';
  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(temp - 273.15) + '°C';
  conditionTxt.textContent = main;
  humidityValue.textContent = humidity + '%';
  windValue.textContent = speed + 'M/s';
  weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;
  currentDate.textContent = getCurrentDate();
  showDisplaySection(weatherInfoSection);

  await updateForecastsInfo(city);
  showDisplaySection(weatherInfoSection);
}
async function updateForecastsInfo(city) {
  const foreCastData = await getFetchData('forecast', city);

  const timeTaken = '12:00:00';
  const todayDate = new Date().toISOString().split('T')[0];
  foreCastData.list.forEach(forecastWeather => {
    if (forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)) {
      updateForecastsItem(forecastWeather);
    }
  })
  console.log(foreCastData);

}
function updateForecastsItem(forecastWeather) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: {temp},

  } = forecastWeather;
  const datetaken = new Date(date);
  const dateoption = {
    day: '2-digit',
    month: 'short',
  };
  const dateResult = datetaken.toLocaleDateString('en-GB',dateoption);
  const forecastItem = `
      <div class="forcast-item">
                    <h5 class="forcate-item-date">
                        ${dateResult}
                    </h5>
                    <img src="assets/weather/${getWeatherIcon(id)}" class="forcast-item-img">
                    <h5 class="forcast-item-temp">${Math.round(temp - 273.15)}°C</h5>
                </div>
    `;
    forecastItemContainer.insertAdjacentHTML('beforeend',forecastItem);
}

function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, sectionNotFound]
    .forEach((sections) => {
      sections.style.display = 'none';
    }

    );
  section.style.display = 'flex';
}