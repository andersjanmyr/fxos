window.Persistence = (function() {
  'use strict';

  function save(name, data) {
    var json = JSON.stringify(data);
    localStorage.setItem(name, json);
  }

  function load(name, defaultData) {
    var json = localStorage.getItem(name);
    if (!json) return defaultData;
    return JSON.parse(json);
  }

  function noop() {
    console.log('noop');
  }

  if ('localStorage' in window)
    return { save: save, load: load };
  else
    return { save: noop, load: noop };
}());

