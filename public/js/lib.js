class App {
  constructor(element) {
    this.element = document.querySelector(element)
    this.components = {}
  }

  addComponent(component) {
    this.components[component.name] = component
  }

  showComponent(name) {
    this.currentComponent = this.components[name]
    this.updateView()
  }

  updateView() {
    if(this.currentComponent) {
      this.element.innerHTML = this.currentComponent.template(this.currentComponent.store.state)
      this.currentComponent.init && this.currentComponent.init(this.currentComponent.store)
    } else {
      this.element.innerHTML = 'Not Found'
    }
  }
}

class Router {
  constructor(app) {
    this.app = app
    this.routes = []
    this.hashChange = this.hashChange.bind(this)
    window.location.hash = '#/'
    window.addEventListener('hashchange', this.hashChange)
    window.addEventListener('DOMContentLoaded', this.hashChange)
  }

  addRoute(name, url) {
    this.routes.push({ name, url })
  }

  hashChange() {
    const hash = window.location.hash
    const route = this.routes.filter(route => hash.match(new RegExp(route.url)))[0]
    if(route) this.app.showComponent(route.name)
    else this.app.showComponent()
  }
}


class View {
  constructor(template, events = {}) {
    this.template = template
    this.events = events
  }

  render(store) {
    return this.template(store)
  }
}
