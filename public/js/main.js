if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then(registration => console.log('ServiceWorker registration successful with scope: ', registration.scope))
  .catch(err => console.log('ServiceWorker registration failed: ', err))
}

if (navigator.geolocation) console.log('Geolocation is supported!')
else console.log('Geolocation is not supported for this Browser/OS version yet.')

// templates 
const loader = () => (
  `<div id="loader" class="loadSpin">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50" xml:space="preserve">
      <path fill="#8a8a8a" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
      </path>
    </svg>
  </div>`
)

const empty = () => (
  `<div id="empty" class="fadeIn">
    <img src="images/empty.svg">
    <h1 class="h2">Got a sushi craving?<h1>
    <h4 class="h4">Find the best sushi restaurants<br> in your neighborhood</h4>
  </div>`
)

const noLocation = (error) => (
  `<div id="no-location" class="fadeIn">
    <img src="images/no-location.svg">
    <h1 class="h2">Can't find your location<h1>
    <h4 id="location-error" class="h4">${error}</h4>
  </div>`
)

const header = (state) => {
  let location = `Tap 'Detect' to find sushi nearby`
  if (state.coords.lat && state.coords.long) location = `${state.coords.lat}, ${state.coords.long}`
  else if (state.geoError && state.geoError !== 2) location = `Bad news! We cannot find you`

  return `<div class="header">
      <div class="block container">
        <h4 class="h4 center">Sushi Hunt</h4>
        <h4 id="location" class="h4 placeholder">
          <span id="latlong">${location}</span>
        </h4>
        <button id="submit">Detect<img src="images/detect.svg"></button>
      </div>
    </div>`
}

const results = (state) => {
  if (state.loader) {
    return loader()
  } else if (state.geoError === 1) {
    return noLocation(`Are you sure your location <br> service is switched on?`)
  } else if (state.geoError === 3) {
    return noLocation(`Are you moving? Hold still, <br> so we can find you!`)
  } else if (state.results) {
    return state.results
  } else {
    return empty()
  }
}

const home = (state) => (
  `${header(state)}
    <div id="results" class="container">
      ${results(state)}
      <a href='/#/about'>About Us</a>
    </div>
  `
)

// application 

const app = new App('#app')
const router = new Router(app)

const createStore = (app, state) => ({
  state: state || {},
  setState(object) {
    this.state = { ...this.state, ...object }
    app.updateView()
  }
})

const store = {
  ...createStore(app, {
    coords: {},
    geoError: false,
    results: null,
    loader: false
  }),
  getLocation() {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, { maximumAge: 0, timeout: 10000 })
    })
  },
  getResults(url) {
    return new Promise(function (resolve, reject) {
      const req = new XMLHttpRequest()
      req.open('GET', url)
      req.onload = function () {
        if (req.status == 200) resolve(req.response)
        else reject(Error(req.statusText))
      }
      req.onerror = function () {
        reject(Error("Network Error"))
      }
      req.send()
    })
  }
}

// components 

app.addComponent({
  name: 'home',
  template: home,
  store,
  init(store) {
    const button = document.getElementById('submit')
    button.addEventListener('click', async function() {
      try {
        const position = await store.getLocation()
        const coords = { lat: position.coords.latitude, long: position.coords.longitude }
        store.setState({ coords, loader: true })
        try {
          const results = await store.getResults(`/results/?lat=${coords.lat}&long=${coords.long}`)
          store.setState({ results, loader: false })
        } catch (err) {
          console.log(err)
        }
      } catch (err) {
        store.setState({ geoError: err.code })
      }
    })
  }
})

app.addComponent({
  name: 'about',
  store,
  template: (state) => `<div>${state.coords.lat} ${state.coords.long}</div>`
})

// routes

router.addRoute('home', '^#/$')
router.addRoute('about', '^#/about$')




