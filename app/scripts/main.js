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
      el('div', 'temp', item.temp),
      el('div', 'weather ' + item.klass, item.desc),
      el('div', 'details', [
        el('div', 'humidity', 'Humidity: ' + item.humidity),
        el('div', 'pressure', 'Pressure: ' + item.pressure),
        el('div', 'max', 'Max: ' + item.max),
        el('div', 'min', 'Min: ' + item.min),
        el('div', 'wind', item.wind)
      ])
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
    $('#weather-list .details').hide();
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

  $('#search-button').click(function() {
    $('#search-form').toggle();
  });

  $('#search-reset').click(function() {
    $('#search').val('');
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

  $('#weather-list').on('click', '.weather-item', function() {
    var visible = $(this).find('.details').is(':visible');
    $('#weather-list .details').hide();
    $(this).find('.details').toggle(!visible);
  });

});
