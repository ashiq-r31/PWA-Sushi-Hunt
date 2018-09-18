const trim = (str) => str.length > 25 ? str.substr(0, 24) + `..` : str

const createRestaurants = (restaurants) => {
  return restaurants.map(listing => {
    const { name, currency, average_cost_for_two, location, user_rating, thumb } = listing.restaurant
    return {
      name: trim(name),
      currency: currency,
      cost_for_two: average_cost_for_two,
      location: trim(location.locality),
      lat: location.latitude,
      long: location.longitude,
      rating: user_rating.aggregate_rating,
      thumb: !thumb.length ? `images/img-placeholder.svg` : thumb,
    }
  })
}

module.exports = createRestaurants
