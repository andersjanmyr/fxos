(function (){
  'use strict';

  var api = 'http://api.openweathermap.org/data/2.5/find?mode=json&type=like&';

  function error(data) {
    console.error('error', data);
  }

  window.weatherApi = {
    getWeather: function (location, callback) {
      var url = api + location.toString();
      jQuery.ajax({url: url, dataType: 'jsonp', success: callback, error: error});
    },
    getWeatherByName: function(name, callback) {
      var url = api + 'q=' + name ;
      jQuery.ajax({url: url, dataType: 'jsonp', success: callback, error: error});
    }
  };

})();
