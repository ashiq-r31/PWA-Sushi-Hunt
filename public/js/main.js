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
    <img src='images/loader.svg'>
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

// setup

const app = new App('#app')
const router = new Router(app)

const createStore = (app, state) => ({
  state: state || {},
  setState(object) {
    this.state = { ...this.state, ...object }
    app.updateView()
  },
  getState(name) {
    return this.state[name] || this.state
  }
})

// store

const store = {
  ...createStore(app, {
    coords: {},
    geoError: false,
    results: null,
    loader: false
  }),
  getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { maximumAge: 0, timeout: 10000 })
    })
  },
  getResults(url) {
    return fetch(url).then(response => response.text())
  }
}

// components 

app.addComponent({
  name: 'home',
  template: home,
  store,
  initialize(store) {
    const button = document.getElementById('submit')
    button.addEventListener('click', async function () {
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




