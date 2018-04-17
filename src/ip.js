const AWSXRay = require('aws-xray-sdk');
const http = AWSXRay.captureHTTPs(require('http'));
const cacheManager = require('cache-manager');
const fsStore = require('cache-manager-fs');
const diskCache = cacheManager.caching({
  store: fsStore,
  options: {
    ttl: 86400,
    maxsize: 1000 * 1000 * 1000 /* max size in bytes on disk */,
    path: '/tmp',
  },
});

const getCoordinates = ip => {
  return diskCache.wrap(ip, () => {
    return new Promise((resolve, reject) => {
      const url = `http://ip-api.com/json/${ip}`;

      http.get(url, res => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', data => {
          body += data;
        });
        res.on('end', () => {
          console.info(body);
          body = JSON.parse(body);
          if (body.lat && body.lon) {
            return resolve({ lat: body.lat, lon: body.lon });
          }
          return reject(new Error('Coordinates not found'));
        });
        res.on('error', () => {
          reject(new Error('Error HTTP'));
        });
      });
    });
  });
};

module.exports = { getCoordinates };
