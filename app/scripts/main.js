$(function() {
  'use strict';

  function el(name, klass, children) {
    var e = document.createElement(name);
    e.className = klass;
    if (!children) return e;
    if (!$.isArray(children)) {
      e.appendChild(document.createTextNode(children));
      return e;
    }
    children.forEach(function(child) {
      e.appendChild(child);
    });
    return e;
  }

  function toCelsius(temp) {
    return parseInt(temp - 273, 10) + '℃';
  }

  function weatherItem(item) {
    console.log(item);
    return el('li', 'weather-item', [
      el('div', 'name', item.name),
      el('div', 'temp', toCelsius(item.main.temp)),
      el('div', 'weather', item.weather[0].main),
      el('div', 'weather-details', item.weather[0].description)
    ]);
  }

  function weatherList(list) {
    var frag = document.createDocumentFragment();
    list.forEach(function(item) {
      frag.appendChild(weatherItem(item));
    });
    return frag;
  }

  function displayWeatherList(list) {
    $('#weather-list').empty().append(weatherList(list));
  }


  var debounce = (function(){
    var timer = 0;
    var timeout = 500;
    return function(callback){
      clearTimeout (timer);
      timer = setTimeout(callback, timeout);
    };
  })();

  $.ajaxSetup({
    beforeSend: function() { $('#spinner').show(); },
    complete: function() { $('#spinner').hide(); },
  });

  window.Gps.position(function(pos) {
    window.weatherApi.getWeather(pos, function(list) {
      displayWeatherList(list);
    });
  });

  $('#search').keyup(function() {
    debounce(function() {
      var val = $('#search').val();
      if (val.length > 2)
        window.weatherApi.getWeatherByName(val, function(list) {
          displayWeatherList(list);
        });
    });
  });

});
