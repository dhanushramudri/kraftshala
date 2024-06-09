import React, { useState, useEffect } from "react";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

const Weather = ({ darkMode }) => {
  const [weatherData, setWeatherData] = useState({
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
  });

  const getWeather = async (lat, lon) => {
    const api_call = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=7e1ac963c038784ef2b4ce75c3261d2c`
    );
    const data = await api_call.json();
    setWeatherData((prevState) => ({
      ...prevState,
      lat: lat,
      lon: lon,
      city: data.name,
      temperatureC: Math.round(data.main.temp),
      temperatureF: Math.round(data.main.temp * 1.8 + 32),
      humidity: data.main.humidity,
      main: data.weather[0].main,
      country: data.sys.country,
    }));
    switch (data.weather[0].main) {
      case "Haze":
        setWeatherData((prevState) => ({ ...prevState, icon: "CLEAR_DAY" }));
        break;
      case "Clouds":
        setWeatherData((prevState) => ({ ...prevState, icon: "CLOUDY" }));
        break;
      case "Rain":
        setWeatherData((prevState) => ({ ...prevState, icon: "RAIN" }));
        break;
      case "Snow":
        setWeatherData((prevState) => ({ ...prevState, icon: "SNOW" }));
        break;
      case "Dust":
        setWeatherData((prevState) => ({ ...prevState, icon: "WIND" }));
        break;
      case "Drizzle":
        setWeatherData((prevState) => ({ ...prevState, icon: "SLEET" }));
        break;
      case "Fog":
        setWeatherData((prevState) => ({ ...prevState, icon: "FOG" }));
        break;
      case "Smoke":
        setWeatherData((prevState) => ({ ...prevState, icon: "FOG" }));
        break;
      case "Tornado":
        setWeatherData((prevState) => ({ ...prevState, icon: "WIND" }));
        break;
      default:
        setWeatherData((prevState) => ({ ...prevState, icon: "CLEAR_DAY" }));
    }
  };

  useEffect(() => {
    const getPosition = (options) => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    if (navigator.geolocation) {
      getPosition()
        .then((position) => {
          getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          getWeather(28.67, 77.22);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }

    const timerID = setInterval(() => {
      getWeather(weatherData.lat, weatherData.lon);
    }, 600000);

    return () => clearInterval(timerID);
  }, [weatherData.lat, weatherData.lon]);

  if (weatherData.temperatureC) {
    return (
      <React.Fragment>
        <div className="city">
          <div className="title">
            <h2>{weatherData.city}</h2>
            <h3>{weatherData.country}</h3>
          </div>
          <div className="mb-icon">
            <ReactAnimatedWeather
              icon={weatherData.icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
            <p>{weatherData.main}</p>
          </div>
          <div className="date-time">
            <div className="dmy">
              <div id="txt"></div>
              <div className="current-time">
                <Clock format="HH:mm:ss" interval={1000} ticking={true} />
              </div>
              <div className="current-date">{dateBuilder(new Date())}</div>
            </div>
            <div className="temperature">
              <p>
                {weatherData.temperatureC}°<span>C</span>
              </p>
            </div>
          </div>
        </div>
        <Forcast
          icon={weatherData.icon}
          weather={weatherData.main}
          darkMode={darkMode}
        />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location will be displayed on the App <br /> & used for
          calculating Real time weather.
        </h3>
      </React.Fragment>
    );
  }
};

export default Weather;
