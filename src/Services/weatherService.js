import { DateTime } from "luxon";

const API_KEY = '8dac1b7b8e56526cb5b1b3d4933f592d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

const getWeatherData = (infoType, searchParams) => {
    const url = new URL(BASE_URL + '/' + infoType)
    url.search = new URLSearchParams({...searchParams, appid:API_KEY}

    )
    
    return fetch(url)
    .then((res) => res.json())
    
};

const formatCurrentWeather = (data) => {
    const {
        coord: { lat, lon },
        main: { temp, feels_like, temp_max, temp_min, humidity },
        name,
        dt,
        sys: { country, sunrise, sunset },
        weather,
        wind: { speed }
    } = data;

    const { main: details, icon } = weather[0];

    return {
        lat,
        lon,
        temp,
        feels_like,
        temp_max,
        temp_min,
        humidity,
        name,
        dt,
        country,
        sunrise,
        sunset,
        details,
        icon,
        speed
    };
};

const formatForecastWeather = (data) => {
    const { timezone } = data;

    const daily = Array.isArray(data.daily)
        ? data.daily.slice(1, 6).map(d => ({
            title: formatToLocalTime(d.dt, timezone, 'ccc'),
            temp: d.temp.day,
            icon: d.weather[0].icon
        }))
        : [];

    const hourly = Array.isArray(data.hourly)
        ? data.hourly.slice(1, 6).map(d => ({
            title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
            temp: d.temp,
            icon: d.weather[0].icon,
        }))
        : [];

    return { timezone, daily, hourly };
};

const getFormattedWeatherData =  async (searchParams) => {
    const formattedCurrentWeather =  await  getWeatherData
    ('weather', searchParams).then(formatCurrentWeather);

    const {lat, lon} = formattedCurrentWeather

    const formattedForecastWeather = await getWeatherData('onecall', {
        lat, lon, 
        exclude: 'current,minutely,alerts', units: searchParams.units,
    }).then(formatForecastWeather) 

    return {...formattedCurrentWeather, ...formattedForecastWeather};
};

const formatToLocalTime = (secs, zone, format = "cccc dd LLL yyyy' | Local time 'hh:mm a:") => 
    DateTime.fromSeconds(secs).setZone(zone).toFormat(format)

const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData; 
export {formatToLocalTime, iconUrlFromCode};