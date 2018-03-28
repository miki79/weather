const { getCoordinates } = require('./ip');
const { getWeather } = require('./weather');

module.exports.weather = (event, context, callback) => {
  const callbackHandler = (body, statusCode = 200) => {
    const response = {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': 'https://miki.me.uk',
      },
      body: JSON.stringify(body),
    };

    callback(null, response);
  };

  const ip = event.requestContext.identity.sourceIp;
  getCoordinates(ip)
    .then(coordinates => {
      getWeather(coordinates)
        .then(data => {
          callbackHandler(data);
        })
        .catch(err => {
          console.info(err);
          callbackHandler('Weather Not Found', 404);
        });
      console.info(coordinates);
    })
    .catch(err => {
      console.info(err);
      callbackHandler('Ip Not Found', 404);
    });
};
