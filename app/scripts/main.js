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

  function weatherItem(item) {
    console.log(item);
    return el('li', 'weather-item', [
      el('div', 'name', item.name),
      el('div', 'temp', item.main.temp),
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
  window.Gps.position(function(pos) {
    window.weatherApi.getWeather(pos, function(list) {
      $('#weather-list').empty().append(weatherList(list));
    });
  });
});
