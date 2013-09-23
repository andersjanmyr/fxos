window.Gps = (function() {
  'use strict';

  function toQuery() {
    // jshint validthis:true
    return 'lat=' + this.latitude + '&lon=' + this.longitude;
  }

  function position(callback) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      callback({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        toString: toQuery
      });
    });
  }

  function noop() {
  }

  if ('geolocation' in navigator)
    return { position: position };
  else
    return { position: noop };
}());
