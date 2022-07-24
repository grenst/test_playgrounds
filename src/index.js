let apiKey = "fe0e0a19e1606bdfe513d213f2be135a";

function getData(response) {
  let cityName = response.data.name;
  let temperature = response.data.main.temp;
  let temp = Math.round(temperature);
  let windSpeed = response.data.wind.speed;
  let windSp = Math.round(windSpeed);
  let hummi = response.data.main.humidity;
  let country = response.data.sys.country;
  let sky = response.data.weather[0].main;
  let tempo = document.querySelector(".temp");
  let cityLable = document.querySelector("#city");
  let cityHumid = document.querySelector(".humi");
  let windCity = document.querySelector(".wind");
  let skyCity = document.querySelector("#sky");
  tempo.innerHTML = `${temp}<span id="units">°C</span>`;
  cityLable.innerHTML = `${cityName} <span class="info">|${country}</span>`;
  cityHumid.innerHTML = `Humidity: ${hummi}%`;
  windCity.innerHTML = `Wind: ${windSp} km/h`;
  skyCity.innerHTML = `Sky: ${sky}`;
  document.getElementById("magic").style.opacity = "1";
}

function success(pos) {
  document.getElementById("magic").style.opacity = "0";
  let lat = pos.coords.latitude;
  let long = pos.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`;
  axios.get(url).then(getData);
}

const form = document.getElementById("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  let cityText = event.target["name"].value;
  if (cityText === "") {
    alert("Be more serious!");
  } else {
    document.getElementById("magic").style.opacity = "0";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityText}&units=metric&appid=${apiKey}`;
    axios.get(url).then(getData, (event.target["name"].value = ""));
  }
});

// function submitLoginForm(event) {
//   event.preventDefault();
//   let cityText = event.target["name"].value;
//   if (cityText === "") {
//     alert("Be more serious!");
//   } else {
//     let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityText}&units=metric&appid=${apiKey}`;
//     axios.get(url).then(getData, (event.target["name"].value = ""));
//   }
// }

function getCurrentPosition1() {
  navigator.geolocation.getCurrentPosition(success);
}

let myPosition = document.querySelector("#location");
myPosition.addEventListener("click", getCurrentPosition1);

/// TIME ZONE

let myDate = new Date();

let daysList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let monthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Aug", "Oct", "Nov", "Dec"];

let date = myDate.getDate();
let month = monthsList[myDate.getMonth()];
let year = myDate.getFullYear();
let day = daysList[myDate.getDay()];

let today = `${date} ${month} ${year}, ${day}`;

let amOrPm;
let twelveHours = function () {
  if (myDate.getHours() > 12) {
    amOrPm = "PM";
    let twentyFourHourTime = myDate.getHours();
    let conversion = twentyFourHourTime - 12;
    if (conversion < 10) {
      return `0${conversion}`;
    } else {
      return `${conversion}`;
    }
  } else {
    amOrPm = "AM";
    if (myDate.getHours() < 10) {
      return `0${myDate.getHours()}`;
    } else {
      return `${myDate.getHours()}`;
    }
  }
};
let hours = twelveHours();
let minutes = myDate.getMinutes();

let currentTime = `${hours}:${minutes} ${amOrPm}`;

let dateToday = document.querySelector("#date");
dateToday.innerHTML = `${today} ${currentTime}`;
