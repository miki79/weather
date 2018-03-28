const request = require('request');
const APP_KEY = process.env.APP_WEATHER_KEY;

const getWeather = coordinates => {
  console.info(APP_KEY);
  return new Promise((resolve, reject) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${
      coordinates.lat
    }&lon=${coordinates.lon}&units=metric&APPID=${APP_KEY}`;
    request({ url, json: true }, (err, response, body) => {
      if (err) {
        return reject(err);
      } else if (response.statusCode !== 200) {
        return reject(new Error(body.message));
      }

      const weather = [];
      body.weather.forEach(data => {
        weather.push({
          main: data.main,
          description: data.description,
          icon: `https://openweathermap.org/img/w/${data.icon}.png`,
        });
      });
      return resolve(weather);
    });
  });
};

module.exports = { getWeather };
