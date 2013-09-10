$(function() {
    'use strict';
    window.Gps.position(function(pos) {
        window.weatherApi.getWeather(pos, function(resp) {
            console.log(resp);
        });
    });
});
