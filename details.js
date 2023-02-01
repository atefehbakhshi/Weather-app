const city_name = location.search.split("city=")[1];
// get elements fron html file
const body = document.getElementById("body");
const container = document.getElementById("container");
const cityName = document.getElementById("city-name");
const date = document.getElementById("date");
const degree = document.getElementById("now");
const minDegree = document.getElementById("min");
const maxDegree = document.getElementById("max");
const weatherCondithin = document.getElementById("weather");
const weatherIcon = document.getElementById("weather-icon");
const hourlyTitle = document.getElementById("hourly-title");
// get information from api by city name
async function gettingCityName(city) {
  try {
    let res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9946cff79fed3fdf4faac05260fe5762`
    );
    let data = await res.json();
    if (data.cod === "404") {
      cityName.innerText = data.message;
    } else {
      showResult(data);
      result(data.id);
    }
  } catch (error) {
    console.error(error);
  }
}
// get information from api by id
async function result(id) {
  try {
    let res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=9946cff79fed3fdf4faac05260fe5762`
    );
    const data = await res.json();
    showHourly(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}
// display date
function today(d) {
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();
  date.innerText = `${year}:${month}:${day}  /  ${hour}:${minute}:${second}`;
  // change background image
  if (hour > 17) {
    body.style.backgroundImage = "url('assets/images/night.jpg')";
  } else {
    body.style.backgroundImage = "url('assets/images/day.jpg')";
  }
}
// dynamic clock
setInterval(() => {
  today(new Date());
}, 1000);

// display results in page
function showResult(data) {
  cityName.innerText = data.name;
  degree.innerText = data.main.temp;
  minDegree.innerText = data.main.temp_min;
  maxDegree.innerText = data.main.temp_max;
  const weather = data.weather[0].main;

  if (weather === "Clear") {
    weatherIcon.src = `./assets/images/clear.png`;
    weatherCondithin.innerText = "Clear";
  } else if (weather === "Clouds") {
    weatherIcon.src = `./assets/images/cloudy.png`;
    weatherCondithin.innerText = "Cloudy";
  } else if (weather === "Rain") {
    weatherIcon.src = `./assets/images/rainy.png`;
    weatherCondithin.innerText = "Rainy";
  } else if (weather === "Snow") {
    weatherIcon.src = `./assets/images/snowy.png`;
    weatherCondithin.innerText = "Snowy";
  } else if (weather === "Mist") {
    weatherIcon.src = `./assets/images/mist.png`;
    weatherCondithin.innerText = "Mist";
  } else {
    weatherIcon.src = `./assets/images/semi-cloudy.png`;
    weatherCondithin.innerText = weather;
  }
}
// display hourly degree
function showHourly(data) {
  hourlyTitle.innerText = "Hourly";
  const [first, second, third, four, five, six, others] = data.list;
  let kelvin = [first, second, third, four, five, six, others];
  let celcius = [];
  let houres = [];
  kelvin.forEach((item) => {
    let temp = Math.round(item.main.temp - 273.15);
    celcius.push(temp);
    houres.push(+item.dt_txt.split(" ")[1].split(":")[0]);
  });

  let xValues = houres;
  let yValues = celcius;
  let minY = yValues[0];
  let maxY = yValues[0];
  // find min and max values of degree
  yValues.forEach((item) => {
    if (item < minY) {
      minY = item;
    }
    if (item > maxY) {
      maxY = item;
    }
  });
  // create linear chart
  new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues,
        },
      ],
    },
    options: {
      legend: { display: false },
      scales: {
        yAxes: [{ ticks: { min: minY - 1, max: maxY + 1 } }],
      },
    },
  });
}

gettingCityName(city_name);
