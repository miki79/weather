const request = require('request');

const getCoordinates = ip => {
  return new Promise((resolve, reject) => {
    const url = `http://ip-api.com/json/${ip}`;
    request({ url, json: true }, (err, response, body) => {
      if (err) {
        return reject(err);
      } else if (body.lat && body.lon) {
        return resolve({ lat: body.lat, lon: body.lon });
      }
      return reject(new Error('Coordinates not found'));
    });
  });
};

module.exports = { getCoordinates };
