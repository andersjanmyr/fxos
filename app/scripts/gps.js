window.Gps = (function() {
  'use strict';

  function position(callback) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      callback({latitude: pos.coords.latitude, longitude: position.coords.longitude});
    });
  }

  function noop() {
  }

  if ('geolocation' in navigator)
    return { position: position };
  else
    return { position: noop };
}());
