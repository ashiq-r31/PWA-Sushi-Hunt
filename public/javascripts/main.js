if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    console.log('ServiceWorker registration failed: ', err);
  });
}

if (navigator.geolocation) {
console.log('Geolocation is supported!');
}
else {
console.log('Geolocation is not supported for this Browser/OS version yet.');
}

function get(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();

    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200) {
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };
    req.send();
  })
}

function findLocation() {
    return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

function geoSuccess(position) {
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  var latshort = lat.toFixed(10) + ", ";
  var longshort = long.toFixed(10);

  document.getElementById('lat').innerHTML = latshort + " " + longshort;

  var latlng = {
    lat: lat,
    long: long
  };

  return latlng;
};

function geoFailure(error){
  document.getElementById('lat').innerHTML = "Failed to find your location.";
  return Promise.reject(error);
}

function searchRestaurants(latlng) {
  document.getElementById('empty').style.display = 'none';
  document.getElementById('restaurants').innerHTML = '';
  document.getElementById('loader').style.display = 'block';
  return get('/results/?lat=' + latlng.lat + '&long=' + latlng.long);
  // return get('/results/?lat=25.14071&long=55.22631799999999');
}

function showRestaurants(restaurants) {
  var content;
  if (restaurants.length === 0) {
    content = document.getElementById('restaurants').innerHTML = "<p>No restaurants near you</p>";
  } else {
    content = document.getElementById('restaurants').innerHTML = restaurants;
  }
  document.getElementById('loader').style.display = 'none';
  return content;
}

function main() {
  findLocation()
  .then(geoSuccess, geoFailure)
  .then(searchRestaurants)
  .then(showRestaurants);
}

var detect = document.getElementById('submit');
detect.addEventListener('click', main);
