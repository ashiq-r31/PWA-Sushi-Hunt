var express = require('express');
var favicon = require('serve-favicon');

var app = express();
app.use(favicon(__dirname + '/public/images/favicon.ico'));

var path = require('path');
var router = express.Router();
var request = require('request');
var exphbs  = require('express-handlebars');

// app.engine('handlebars', exphbs({partialsDir: __dirname + 'public/views/partials'}));
app.set('view engine', 'handlebars');

app.engine('handlebars', exphbs({extname: 'handlebars'}));
app.set('views', __dirname + '/public/views');
app.use(express.static(path.join(__dirname, 'public')));

//main routes for the app

router.get('/', function(req, res){
  res.render('app-shell');
});

router.get('/results', function(req, res){
  var lat = req.query.lat;
  var long = req.query.long;
  var url = 'https://developers.zomato.com/api/v2.1/search?count=10&lat=' + lat + '&lon=' + long +  '&radius=2000&cuisines=177&sort=real_distance&order=asc';

  var options = {
    url : url,
    headers: {'user-key':'f5f2528732be2d46729a68d5754da4d9'},
    gzip:true
  };

  function shortenString(string){
    if (string.length > 25) {
        string.substr(0, 24) + "..";
    }
    return string;
  }

  function checkRestaurants(object) {
    if (object.length === 0) {
      res.render('partials/no-restaurants');
    } else {
      var results = object.map(function(obj){
        var thumb = obj.restaurant.thumb;
        if (thumb.length === 0) {
            thumb = "images/img-placeholder.svg";
        }
        return {
            name: shortenString(obj.restaurant.name),
            currency: obj.restaurant.currency,
            cost_for_two: obj.restaurant.average_cost_for_two,
            location: shortenString(obj.restaurant.location.locality),
            lat: obj.restaurant.location.latitude,
            long: obj.restaurant.location.longitude,
            rating: obj.restaurant.user_rating.aggregate_rating,
            thumb: thumb,
        }
      });

      res.render('partials/results', {filtered: results});
    }
  }

  request(options, function(err, response, body){

    if(!err && response.statusCode === 200) {
      var respObj = JSON.parse(body);
      var restaurants = respObj.restaurants;
      checkRestaurants(restaurants);
    } else {
      console.log(error);
    }
  });

});

app.use('/', router);


app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
