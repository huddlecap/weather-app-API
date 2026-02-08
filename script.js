function handleWeatherSearch() {
  const input = document.getElementById("city");
  const city = input.value.trim();

  if (!city) return alert("Please enter a city");

  fetchWeather(city);
  input.value = "";
}

document.getElementById("getWeather").addEventListener("click", handleWeatherSearch);
document.getElementById("city").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleWeatherSearch();
  }
});

function renderWeather(data) {
  document.getElementById("cityName").textContent = data.city;
  document.getElementById("temp").textContent = data.temp;
  document.getElementById("condition").textContent = data.condition;
}

const API_KEY = "2K7PMDG3SGMG73KQ4QZK74XNZ"; 

async function fetchWeather(city) {

  showLoading();
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/today?unitGroup=metric&key=${API_KEY}&include=current`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    // Extract temperature and weather condition
    const temp = data.currentConditions.temp;
    const weatherMain = data.currentConditions.conditions; // e.g., "Rain", "Clear", "Snow"

    renderWeather({
      city: city,
      temp: `${temp}°C`,
      condition: weatherMain
    });

    fetchCityImage(city, weatherMain);

    console.log("Temp:", temp, "Weather:", weatherMain);

  } catch (err) {
    alert(err.message);
  } finally {
    hideLoading();
  }
}

const PEXELS_KEY = "dJkHdeO0Qb7FKOxhWEcn3xRQw3rmwN9RM8Kb1reBJnVm7B9RN5LQNONO";

async function fetchCityImage(city, condition) {
  try {
    const query = `${city} ${condition}`;

    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_KEY
        }
      }
    );

    const data = await res.json();
    console.log(data);

    if (!data.photos.length) return;

    const imageUrl = data.photos[0].src.landscape;

    document.body.style.backgroundImage = `url(${imageUrl})`;

  } catch (err) {
    console.log("Image fetch failed", err);
  }
}

function showLoading() {
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("getWeather").disabled = true;
}
//
function hideLoading() {
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("getWeather").disabled = false;
}



