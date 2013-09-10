(function (){
  'use strict';

  var api = 'http://api.openweathermap.org/data/2.5/find?mode=json&type=like&';

  function error(data) {
    console.error('error', data);
  }

  function callApi(query, callback) {
    function success(resp) {
      callback(resp.list);
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
