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

  function packSwitch(selected) {
    console.log(selected);
    var label = document.createElement('label');
    label.className = 'pack-switch save-button';
    var cb = document.createElement('input');
    cb.setAttribute('type', 'checkbox');
    cb.checked = selected;
    label.appendChild(cb);
    label.appendChild(document.createElement('span'));
    return label;
  }

  function weatherItem(item) {
    console.log(item);
    var names = window.Persistence.load('names', []);
    var element = el('li', 'weather-item', [
      el('div', 'name', item.name),
      el('div', 'temp', item.temp),
      el('div', 'weather ' + item.klass, item.desc),
      el('div', 'details', [
        el('div', 'humidity', 'Humidity: ' + item.humidity),
        el('div', 'pressure', 'Pressure: ' + item.pressure),
        el('div', 'max', 'Max: ' + item.max),
        el('div', 'min', 'Min: ' + item.min),
        el('div', 'wind', item.wind),
        packSwitch(names.indexOf(item.name) !== -1)
      ])
    ]);
    element.dataset.name = item.name;
    return element;
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

  $('#search-button').click(function() {
    $('#search-form').toggle();
    $('#search').focus();
  });

  $('#search-reset').click(function() {
    $('#search').val('');
  });

  $('#search').keyup(function() {
    debounce(function() {
      var val = $('#search').val();
      if (val.length > 2)
        window.weatherApi.findByName(val, function(list) {
          displayWeatherList(list);
        });
    });
  });

  $('#camera-button').click(function() {
    $('#camera').click();
  });

  $('#camera').on('change', function (event) {
    var files = event.target.files;
    if (files && files.length > 0) {
      var file = files[0];
      console.log('Got file', file);
    }
  });

  $('#weather-list').on('click', '.weather-item', function() {
    var visible = $(this).find('.details').is(':visible');
    $('#weather-list .details').hide();
    $(this).find('.details').toggle(!visible);
  });

  function remove(array, el) {
    var index = array.indexOf(el);
    array.splice(index, 1);
  }

  $('#weather-list').on('click', '.save-button', function() {
    var cb = $(this).find('input');
    var checked = !cb.prop('checked');
    cb.prop('checked', checked);
    var name = $(this).parents('.weather-item').data('name');
    var names = window.Persistence.load('names', []);
    if (checked)
      names.push(name);
    else
      remove(names, name);
    var uniqueNames = names.filter(function(elem, pos) {
      return elem && names.indexOf(elem) === pos;
    });
    window.Persistence.save('names', uniqueNames);
    return false;
  });

  function updateWeather(pos) {
    var favorites = [];
    if (pos) {
      var byPos = window.weatherApi.getByLocation(pos);
      favorites.unshift(byPos);
    }
    var names = window.Persistence.load('names', []);
    if (names.length === 0) names.push('Skåne');
    names.forEach(function(name) {
      favorites.push(window.weatherApi.getByName(name));
    });
    $.when.apply(window, favorites).then(function() {
      var args = Array.prototype.slice.apply(arguments);
      var list = args.map(function(arr) {
        return window.weatherApi.toItem(arr[0]);
      }).filter(function(item){ return item; });
      console.log(list);
      displayWeatherList(list);
    });
  }

  window.Gps.position(updateWeather);
  updateWeather();

});
