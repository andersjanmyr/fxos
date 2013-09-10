(function (){
  'use strict';

  var api = 'http://api.openweathermap.org/data/2.5/find?mode=json&type=like&';

  function error(data) {
    console.error('error', data);
  }

  function toCelsius(temp) {
    return parseInt(temp - 273, 10) + '℃';
  }

  function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function toItem(item) {
      return {
          name: item.name,
          temp: toCelsius(item.main.temp),
          klass: item.weather[0].main.toLowerCase(),
          desc: capitalize(item.weather[0].description),
          humidity: item.main.humidity,
          pressure: item.main.pressure,
          max: item.main.temp_max,
          min: item.main.temp_min,
          wind: item.wind.speed
      }
  }

  function callApi(query, callback) {
    function success(resp) {
      callback(resp.list.map(toItem));
    }
    var url = api + query;
    jQuery.ajax({
      url: url,
      dataType: 'jsonp',
      success: success,
      error: error});
  }


  window.weatherApi = {
    getWeather: function (location, callback) {
      callApi(location, callback);
    },
    getWeatherByName: function(name, callback) {
      callApi('q=' + name, callback);
    }
  };

})();
