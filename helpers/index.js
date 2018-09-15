const trim = (str) => str.length > 25 ? str.substr(0, 24) + `..` : str

const createRestaurants = (restaurants) => {
  return restaurants.map(listing => {
    const restaurant = listing.restaurant
    return {
      name: trim(restaurant.name),
      currency: restaurant.currency,
      cost_for_two: restaurant.average_cost_for_two,
      location: trim(restaurant.location.locality),
      lat: restaurant.location.latitude,
      long: restaurant.location.longitude,
      rating: restaurant.user_rating.aggregate_rating,
      thumb: !thumb.length ? `images/img-placeholder.svg` : thumb,
    }
  })
}

module.exports = createRestaurants
