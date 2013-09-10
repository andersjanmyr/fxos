// awesome javascript goes here


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else {
    $('#demo').html("Geolocation is not supported by this browser.")
  }
}
function showPosition(position) {
  $('#demo').html("Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude)
}

//getLocation()
//$('#demo').html("HEJ")
//console.log("HOHO2")