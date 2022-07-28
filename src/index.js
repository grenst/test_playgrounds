const apiKey = "fe0e0a19e1606bdfe513d213f2be135a";

function weatherStart(temp) {
  cityName = temp;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityTemp}&units=metric&appid=${apiKey}`;
  axios.get(url).then(getData);
}

function demoStart() {
  unit = "c";
  cityName = "Lisabon";
  cityTemp = cityName;
  weatherStart(cityName);
}

let unit;
let cityName;
let cityTemp;
demoStart();

function getData(response) {
  cityName = response.data.name;
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
  tempo.innerHTML = `${c2f(temp)}`;
  cityLable.innerHTML = `${cityName} <span class="info">|${country}</span>`;
  cityHumid.innerHTML = `Humidity: ${hummi}%`;
  windCity.innerHTML = `Wind: ${windSp} km/h`;
  skyCity.innerHTML = `Sky: ${sky}`;
  document.getElementById("magic").style.opacity = "1";
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(url).then(graphic);
}

function chekerUnits() {
  if (unit === "c") {
    weatherStart();
    unit = "f";
  } else {
    weatherStart();
    unit = "c";
  }
}

let searchUnit = document.getElementById("units");
searchUnit.addEventListener("click", chekerUnits);

function c2f(tempUnit) {
  if (unit === "c") {
    searchUnit.innerHTML = `<strong>°C</strong> |°F`;
    return tempUnit;
  } else {
    let f = Math.round(tempUnit * 1.8 + 32);
    searchUnit.innerHTML = `<strong>°F</strong> |°C`;
    return f;
  }
}

function graphic(res) {
  let d1 = res.data.list[0].main.temp_max;
  let d1r = Math.round(d1);
  let g1 = persGraf(d1r);
  let date1ms = res.data.list[0].dt * 1000;
  let date1dt = new Date(date1ms);
  let d2 = res.data.list[1].main.temp_max;
  let d2r = Math.round(d2);
  let g2 = persGraf(d2r);
  let date2ms = res.data.list[1].dt * 1000;
  let date2dt = new Date(date2ms);
  let d3 = res.data.list[2].main.temp_max;
  let d3r = Math.round(d3);
  let g3 = persGraf(d3r);
  let date3ms = res.data.list[2].dt * 1000;
  let date3dt = new Date(date3ms);
  let d4 = res.data.list[3].main.temp_max;
  let d4r = Math.round(d4);
  let g4 = persGraf(d4r);
  let date4ms = res.data.list[3].dt * 1000;
  let date4dt = new Date(date4ms);
  let d5 = res.data.list[4].main.temp_max;
  let d5r = Math.round(d5);
  let g5 = persGraf(d5r);
  let date5ms = res.data.list[4].dt * 1000;
  let date5dt = new Date(date5ms);
  const element = document.querySelector(".days-graph");
  let polygon = `polygon(0% ${g1}%, 25% ${g2}%, 50% ${g3}%, 75% ${g4}%, 100% ${g5}%, 100% 100%, 0% 100%)`;
  element.style.setProperty("--polygone", polygon);
  let graphic = document.querySelector(".days-graph");
  graphic.innerHTML = res.data.list[0].dt_txt;
  const temp1 = document.querySelector(".point1");
  const temp2 = document.querySelector(".point2");
  const temp3 = document.querySelector(".point3");
  const temp4 = document.querySelector(".point4");
  const temp5 = document.querySelector(".point5");
  temp1.innerHTML = `${c2f(d1r)}°`;
  temp2.innerHTML = `${c2f(d2r)}°`;
  temp3.innerHTML = `${c2f(d3r)}°`;
  temp4.innerHTML = `${c2f(d4r)}°`;
  temp5.innerHTML = `${c2f(d5r)}°`;
  temp1.style.setProperty("--x1", `${g1 + 15}px`);
  temp2.style.setProperty("--x2", `${g2 + 15}px`);
  temp3.style.setProperty("--x3", `${g3 + 15}px`);
  temp4.style.setProperty("--x4", `${g4 + 15}px`);
  temp5.style.setProperty("--x5", `${g5 + 15}px`);
  let timmi1 = document.querySelector(".time1");
  timmi1.innerHTML = `${zeroBefore(date1dt.getHours())}:${zeroBefore(date1dt.getMinutes())}`;
  let timmi2 = document.querySelector(".time2");
  timmi2.innerHTML = `${zeroBefore(date2dt.getHours())}:${zeroBefore(date2dt.getMinutes())}`;
  let timmi3 = document.querySelector(".time3");
  timmi3.innerHTML = `${zeroBefore(date3dt.getHours())}:${zeroBefore(date3dt.getMinutes())}`;
  let timmi4 = document.querySelector(".time4");
  timmi4.innerHTML = `${zeroBefore(date4dt.getHours())}:${zeroBefore(date4dt.getMinutes())}`;
  let timmi5 = document.querySelector(".time5");
  timmi5.innerHTML = `${zeroBefore(date5dt.getHours())}:${zeroBefore(date5dt.getMinutes())}`;
}

function zeroBefore(inver) {
  if (inver < 10) {
    return `0${inver}`;
  } else {
    return `${inver}`;
  }
}

function persGraf(vari) {
  let a = 100 - (vari - 8) * 4;
  return a;
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
    cityTemp = cityText;
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
