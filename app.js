const express = require('express')
const favicon = require('serve-favicon')
const exphbs = require('express-handlebars')
const request = require('request')
const path = require('path')
const app = express()

require('dotenv').load()

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', '.hbs')
app.engine('.hbs', exphbs({ extname: '.hbs' }))
app.set('views', __dirname + '/public/views')
app.use(favicon(__dirname + '/public/images/favicon.ico'))

const router = express.Router()

router.get('/', function (req, res) {
  res.render('app-shell')
})

router.get('/results', function (req, res) {
  const { lat, long } = req.query
  const options = {
    url: `${process.env.API_URL}/search?count=10&lat=${lat}&lon=${long}&radius=2000&cuisines=177&sort=real_distance&order=asc`,
    headers: {
      'user-key': process.env.API_SECRET
    },
    gzip: true
  }

  const createRestaurants = require('./helpers')

  request(options, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const result = JSON.parse(body)
      if(!result.restaurants.length) res.render('partials/no-restaurants')
      else res.render('partials/results', { restaurants: createRestaurants(result.restaurants) })
    } else {
      console.log(err)
    }
  })

})

app.use('/', router)

app.set('port', (process.env.PORT || 5000))

//For avoiding Heroku $PORT error
app.get('/', function (request, response) {
  response.send('App is running')
}).listen(app.get('port'), function () {
  console.log('App is running, server is listening on port ', app.get('port'))
})
