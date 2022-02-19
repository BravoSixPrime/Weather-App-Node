const request = require("request");

const weather = (lat, long, callback) => {
    url = 'http://api.weatherstack.com/current?access_key=9702ffa3c9aba5c257777b3125e6055d&query=' + lat + ',' + long;
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Could not access weather service', undefined);
        } else if (body.error) {
            callback('No weather data found', undefined);
        } else {
            callback(undefined, body.current.weather_descriptions[0]);
        }
    })
}

module.exports = weather;