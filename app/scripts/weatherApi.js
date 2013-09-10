(function (){
  'use strict';

  var findApi = 'http://api.openweathermap.org/data/2.5/find?mode=json&type=like&';
  var getApi = 'http://api.openweathermap.org/data/2.5/weather?';

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
          name: item.name || item.sys.country,
          temp: toCelsius(item.main.temp),
          klass: item.weather[0].main.toLowerCase(),
          desc: capitalize(item.weather[0].description),
          humidity: parseInt(item.main.humidity, 10) + ' %',
          pressure: item.main.pressure + ' mBar',
          max: toCelsius(item.main.temp_max),
          min: toCelsius(item.main.temp_min),
          wind: parseInt(item.wind.speed, 10) + ' m/s'
      }
  }

  function callApi(api, query, callback) {
    function success(resp) {
      if (callback) callback(resp.list.map(toItem));
    }
    var url = api + query;
    return jQuery.ajax({
      url: url,
      dataType: 'jsonp',
      success: success,
      error: error});
  }


  window.weatherApi = {
    findByLocation: function (location, callback) {
      return callApi(findApi, location, callback);
    },
    getByLocation: function (location, callback) {
      return callApi(getApi, location, callback);
    },
    findByName: function(name, callback) {
      return callApi(findApi, 'q=' + name, callback);
    },
    getByName: function(name, callback) {
      return callApi(getApi, 'q=' + name, callback);
    }
  };

})();
