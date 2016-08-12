var express = require('express');
var favicon = require('serve-favicon');

var app = express();
app.use(favicon(__dirname + '/public/images/favicon.ico'));

var path = require('path');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');


app.engine('handlebars', exphbs({partialsDir: __dirname + 'public/views/partials'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());

app.set('views', __dirname + '/public/views');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:true}));


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
    headers: {'user-key':'f5f2528732be2d46729a68d5754da4d9'}
  };

  request(options, function(err, response, body){

    if(!err && response.statusCode === 200) {
      var respObj = JSON.parse(body);
      var restaurants = respObj.restaurants;

      var results = restaurants.map(function(obj){
        var arr = {};

        var name = obj.restaurant.name;
        if (name.length > 25) {
          arr.name = name.substr(0, 24) + "..";
        } else {
          arr.name = name;
        }

        arr.currency = obj.restaurant.currency;
        arr.cost_for_two = obj.restaurant.average_cost_for_two;

        console.log(arr.currency);

        var location = obj.restaurant.location.locality;
        if (location.length > 25) {
          arr.location = location.substr(0, 24) + "..";
        } else {
          arr.location = location;
        }

        arr.rating = obj.restaurant.user_rating.aggregate_rating;
        arr.thumb = obj.restaurant.thumb;

        return arr;
      });

      res.render('partials/results', {filtered:results});
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
