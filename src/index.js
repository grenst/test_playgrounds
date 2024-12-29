const apiKey = "fe0e0a19e1606bdfe513d213f2be135a";
let correct;

function weatherStart(temp) {
  cityName = temp;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityTemp}&units=metric&appid=${apiKey}`;
  axios.get(url).then(getData);
}

function demoStart() {
  unit = "c";
  cityName = "Abu Dhabi";
  cityTemp = cityName;
  weatherStart(cityName);
}

// Calculating correction for graphic depend from temp//
function correction(temp) {
  if (temp > 25) {
    correct = 16;
  } else {
    if (temp < 0) {
      correct = -16;
    } else {
      if (temp < 10) {
        correct = -4;
      } else {
        correct = 4;
      }
    }
  }
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

let unit;
let cityName;
let cityTemp;
demoStart();

function getData(response) {
  cityName = response.data.name;
  let temperature = response.data.main.temp;
  let temp = Math.round(temperature);
  correction(temp);
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
  skyCity.innerHTML = `Sky: ${imgSky(sky)}`;
  document.getElementById("magic").style.opacity = "1";
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(url).then(graphic);
}

function imgSky(value) {
  let skyPos = document.getElementById("weather-img");
  if (value === "Clear") {
    skyPos.classList.add("clear");
    skyPos.classList.remove("rain");
    skyPos.classList.remove("clowds");
    return value;
  } else {
    if (value === "Rain") {
      skyPos.classList.add("rain");
      skyPos.classList.remove("clear");
      skyPos.classList.remove("clowds");
      return value;
    } else {
      skyPos.classList.add("clowds");
      skyPos.classList.remove("rain");
      skyPos.classList.remove("clear");
      return value;
    }
  }
}

function skyForecast(value) {
  let imgForecast = `<img class="iamge" src="images/sunny.png" alt=""></img>`;
  if (value === "Clear") {
    return imgForecast;
  } else {
    if (value === "Rain") {
      imgForecast = `<img class="iamge" src="images/thunderstorms.png" alt=""></img>`;
      return imgForecast;
    } else {
      imgForecast = `<img class="iamge" src="images/partly_cloudy.png" alt=""></img>`;
      return imgForecast;
    }
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

let nextForecast;

function roundIts(value) {
  let q = Math.round(value);
  return q;
}

function graphic(res) {
  if (!res.data || !res.data.list || res.data.list.length < 5) {
    console.error("Недостаточно данных для графика.");
    return;
  }

  let d1r = roundIts(res.data.list[0].main.temp_max);
  let d2r = roundIts(res.data.list[2].main.temp_max); // Каждые 6 часов
  let d3r = roundIts(res.data.list[4].main.temp_max);
  let d4r = roundIts(res.data.list[6].main.temp_max);
  let d5r = roundIts(res.data.list[8].main.temp_max);

  let g1 = persGraf(d1r);
  let g2 = persGraf(d2r);
  let g3 = persGraf(d3r);
  let g4 = persGraf(d4r);
  let g5 = persGraf(d5r);

  const element = document.querySelector(".days-graph");
  let polygon = `polygon(0% ${g1}%, 25% ${g2}%, 50% ${g3}%, 75% ${g4}%, 100% ${g5}%, 100% 100%, 0% 100%)`;

  if ([g1, g2, g3, g4, g5].some((g) => g < 0 || g > 100)) {
    console.error("Некорректные значения графика:", g1, g2, g3, g4, g5);
    return;
  }

  element.style.setProperty("--polygone", polygon);

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
}

function timeGraph(timer) {
  let b = `${zeroBefore(timer.getHours())}:${zeroBefore(timer.getMinutes())}`;
  return b;
}

function dateForecast(timer) {
  let dayForecast = zeroBefore(timer.getDate());
  let monthForecast = zeroBefore(timer.getMonth() + 1);
  let c = `${dayForecast}:${monthForecast}`;
  return c;
}

function zeroBefore(inver) {
  if (inver < 10) {
    return `0${inver}`;
  } else {
    return `${inver}`;
  }
}

function persGraf(vari) {
  let a = 100 - (vari - correct) * 4;
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


// ----------------------------------


// let unit;
// let cityName;
// let cityTemp;
// demoStart();

// function getData(response) {
//   cityName = response.data.name;
//   let temperature = response.data.main.temp;
//   let temp = Math.round(temperature);
//   correction(temp);
//   let windSpeed = response.data.wind.speed;
//   let windSp = Math.round(windSpeed);
//   let hummi = response.data.main.humidity;
//   let country = response.data.sys.country;
//   let sky = response.data.weather[0].main;
//   let tempo = document.querySelector(".temp");
//   let cityLable = document.querySelector("#city");
//   let cityHumid = document.querySelector(".humi");
//   let windCity = document.querySelector(".wind");
//   let skyCity = document.querySelector("#sky");
//   tempo.innerHTML = `${c2f(temp)}`;
//   cityLable.innerHTML = `${cityName} <span class="info">|${country}</span>`;
//   cityHumid.innerHTML = `Humidity: ${hummi}%`;
//   windCity.innerHTML = `Wind: ${windSp} km/h`;
//   skyCity.innerHTML = `Sky: ${imgSky(sky)}`;
//   document.getElementById("magic").style.opacity = "1";
//   let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
//   axios.get(url).then(graphic);
// }

// function imgSky(value) {
//   let skyPos = document.getElementById("weather-img");
//   if (value === "Clear") {
//     skyPos.classList.add("clear");
//     skyPos.classList.remove("rain");
//     skyPos.classList.remove("clowds");
//     return value;
//   } else {
//     if (value === "Rain") {
//       skyPos.classList.add("rain");
//       skyPos.classList.remove("clear");
//       skyPos.classList.remove("clowds");
//       return value;
//     } else {
//       skyPos.classList.add("clowds");
//       skyPos.classList.remove("rain");
//       skyPos.classList.remove("clear");
//       return value;
//     }
//   }
// }

// function skyForecast(value) {
//   let imgForecast = `<img class="iamge" src="images/sunny.png" alt=""></img>`;
//   if (value === "Clear") {
//     return imgForecast;
//   } else {
//     if (value === "Rain") {
//       imgForecast = `<img class="iamge" src="images/thunderstorms.png" alt=""></img>`;
//       return imgForecast;
//     } else {
//       imgForecast = `<img class="iamge" src="images/partly_cloudy.png" alt=""></img>`;
//       return imgForecast;
//     }
//   }
// }

// let searchUnit = document.getElementById("units");
// searchUnit.addEventListener("click", chekerUnits);

// function c2f(tempUnit) {
//   if (unit === "c") {
//     searchUnit.innerHTML = `<strong>°C</strong> |°F`;
//     return tempUnit;
//   } else {
//     let f = Math.round(tempUnit * 1.8 + 32);
//     searchUnit.innerHTML = `<strong>°F</strong> |°C`;
//     return f;
//   }
// }

// let nextForecast;

// function roundIts(value) {
//   let q = Math.round(value);
//   return q;
// }

// function graphic(res) {
//   let dayz = [7, 15, 23, 31, 39];
//   let forecast = '<div class="row">';
//   let firstHourForecast = new Date(res.data.list[8].dt * 1000).getHours() + 1;
//   if (firstHourForecast >= 12) {
//     dayz.forEach((element) => {
//       let arr = (21 - firstHourForecast) / 3 + element - 4;
//       let nightArr = arr - 4;
//       console.log(`${arr} - ${firstHourForecast}`);
//       nextForecast = `<div class="col-2 f1">
//                   ${dateForecast(new Date(res.data.list[arr].dt * 1000))}
//                   ${skyForecast(res.data.list[arr].weather[0].main)}
//                   <strong>${c2f(roundIts(res.data.list[arr].main.temp_max))}°</strong> - ${c2f(
//         roundIts(res.data.list[nightArr].main.temp_min)
//       )}°
//                 </div>`;
//       forecast = forecast + nextForecast;
//     });
//   } else {
//     dayz.forEach((element) => {
//       let night = element + 4;
//       nextForecast = `<div class="col-2 f1">
//                   ${dateForecast(new Date(res.data.list[element].dt * 1000))}
//                   ${skyForecast(res.data.list[element].weather[0].main)}
//                   <strong>${c2f(roundIts(res.data.list[element].main.temp_max))}°</strong> - ${c2f(
//         roundIts(res.data.list[night].main.temp_min)
//       )}°
//                 </div>`;
//       forecast = forecast + nextForecast;
//     });
//   }
//   let d1r = roundIts(res.data.list[0].main.temp_max);
//   let g1 = persGraf(d1r);
//   let date1ms = res.data.list[0].dt * 1000;
//   let date1dt = new Date(date1ms);
//   let d2r = roundIts(res.data.list[1].main.temp_max);
//   let g2 = persGraf(d2r);
//   let date2ms = res.data.list[1].dt * 1000;
//   let date2dt = new Date(date2ms);
//   let d3r = roundIts(res.data.list[2].main.temp_max);
//   let g3 = persGraf(d3r);
//   let date3ms = res.data.list[2].dt * 1000;
//   let date3dt = new Date(date3ms);
//   let d4r = roundIts(res.data.list[3].main.temp_max);
//   let g4 = persGraf(d4r);
//   let date4ms = res.data.list[3].dt * 1000;
//   let date4dt = new Date(date4ms);
//   let d5r = roundIts(res.data.list[4].main.temp_max);
//   let g5 = persGraf(d5r);
//   let date5ms = res.data.list[4].dt * 1000;
//   let date5dt = new Date(date5ms);
//   const element = document.querySelector(".days-graph");
//   let polygon = `polygon(0% ${g1}%, 25% ${g2}%, 50% ${g3}%, 75% ${g4}%, 100% ${g5}%, 100% 100%, 0% 100%)`;
//   element.style.setProperty("--polygone", polygon);
//   let graphic = document.querySelector(".days-graph");
//   graphic.innerHTML = res.data.list[0].dt_txt;
//   const temp1 = document.querySelector(".point1");
//   const temp2 = document.querySelector(".point2");
//   const temp3 = document.querySelector(".point3");
//   const temp4 = document.querySelector(".point4");
//   const temp5 = document.querySelector(".point5");
//   let displayForecast = document.querySelector("#forecast");
//   temp1.innerHTML = `${c2f(d1r)}°`;
//   temp2.innerHTML = `${c2f(d2r)}°`;
//   temp3.innerHTML = `${c2f(d3r)}°`;
//   temp4.innerHTML = `${c2f(d4r)}°`;
//   temp5.innerHTML = `${c2f(d5r)}°`;
//   displayForecast.innerHTML = forecast + `</div>`;
//   temp1.style.setProperty("--x1", `${g1 + 15}px`);
//   temp2.style.setProperty("--x2", `${g2 + 15}px`);
//   temp3.style.setProperty("--x3", `${g3 + 15}px`);
//   temp4.style.setProperty("--x4", `${g4 + 15}px`);
//   temp5.style.setProperty("--x5", `${g5 + 15}px`);
//   let timmi1 = document.querySelector(".time1");
//   timmi1.innerHTML = timeGraph(date1dt);
//   let timmi2 = document.querySelector(".time2");
//   timmi2.innerHTML = timeGraph(date2dt);
//   let timmi3 = document.querySelector(".time3");
//   timmi3.innerHTML = timeGraph(date3dt);
//   let timmi4 = document.querySelector(".time4");
//   timmi4.innerHTML = timeGraph(date4dt);
//   let timmi5 = document.querySelector(".time5");
//   timmi5.innerHTML = timeGraph(date5dt);
// }

// function timeGraph(timer) {
//   let b = `${zeroBefore(timer.getHours())}:${zeroBefore(timer.getMinutes())}`;
//   return b;
// }

// function dateForecast(timer) {
//   let dayForecast = zeroBefore(timer.getDate());
//   let monthForecast = zeroBefore(timer.getMonth() + 1);
//   let c = `${dayForecast}:${monthForecast}`;
//   return c;
// }

// function zeroBefore(inver) {
//   if (inver < 10) {
//     return `0${inver}`;
//   } else {
//     return `${inver}`;
//   }
// }

// function persGraf(vari) {
//   let a = 100 - (vari - correct) * 4;
//   return a;
// }

// function success(pos) {
//   document.getElementById("magic").style.opacity = "0";
//   let lat = pos.coords.latitude;
//   let long = pos.coords.longitude;
//   let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`;
//   axios.get(url).then(getData);
// }

// const form = document.getElementById("form");
// form.addEventListener("submit", (event) => {
//   event.preventDefault();
//   let cityText = event.target["name"].value;
//   if (cityText === "") {
//     alert("Be more serious!");
//   } else {
//     cityTemp = cityText;
//     document.getElementById("magic").style.opacity = "0";
//     let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityText}&units=metric&appid=${apiKey}`;
//     axios.get(url).then(getData, (event.target["name"].value = ""));
//   }
// });
