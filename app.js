var express = require('express');
var favicon = require('serve-favicon');

var app = express();
app.use(favicon(__dirname + '/public/images/favicon.ico'));

var path = require('path');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');


app.engine('handlebars', exphbs({partialsDir: __dirname + '/views/partials'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:true}));


//main routes for the app

router.get('/', function(req, res){
  res.render('index');
});

router.get('/feed', function(req, res){
  locals = {
   budget: req.query.budget
  }
  res.render('feed', locals);
});

router.get('/results', function(req, res){

  var budget = req.query.budget;
  var options = {
    url : 'https://developers.zomato.com/api/v2.1/search?entity_id=51&entity_type=city&cuisines=177&sort=cost&order=asc',

    headers: {'user-key':'f5f2528732be2d46729a68d5754da4d9'}
  };

  // var options = 'https://rawgit.com/ashiq-r31/sample/master/sample.json';

  request(options, function(err, response, body){

    if(!err && response.statusCode === 200) {
      var respObj = JSON.parse(body);
      var restaurants = respObj.restaurants;

      var results = restaurants.map(function(obj){
        var arr = {};

        var name = obj.restaurant.name;
        if (name.length > 25) {
          arr.name = name.substring(0, 24) + "..";
        } else {
          arr.name = name;
        }
        arr.cost_for_two = obj.restaurant.average_cost_for_two;

        var location = obj.restaurant.location.locality;
        if (location.length > 16) {
          arr.location = location.substring(0, 15) + "..";
        } else {
          arr.location = location;
        }

        arr.rating = obj.restaurant.user_rating.aggregate_rating;
        arr.thumb = obj.restaurant.thumb;

        return arr;
      });

      var maxNum = parseInt(budget);
      var filtered = [];
      results.forEach(function(obj){

            if (obj.cost_for_two < maxNum){
              filtered.push(obj);
            } else if (maxNum === NaN) {
              filtered.push(obj);
            }
      });

      res.render('partials/results', {filtered:filtered});
    }
  });

});

app.use('/', router);

app.listen(8888, function(){
  console.log('Sushi Hunt is listening on port 8888!');
});
