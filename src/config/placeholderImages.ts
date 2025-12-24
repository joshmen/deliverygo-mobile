/**
 * Placeholder Images
 * Template food/restaurant images for fallback display
 */

// Restaurant/Food images for store cards
export const restaurantImages = [
  require('../../assets/images/food1.jpg'),
  require('../../assets/images/food2.jpg'),
]

// Menu item image for cart/products
export const menuItemImage = require('../../assets/images/burgerImg.png')

// Category images
export const categoryImages = [
  require('../../assets/images/cat1.png'),
  require('../../assets/images/cat2.png'),
  require('../../assets/images/cat3.png'),
  require('../../assets/images/cat4.png'),
  require('../../assets/images/cat5.png'),
  require('../../assets/images/cat6.png'),
  require('../../assets/images/cat7.png'),
  require('../../assets/images/cat8.png'),
  require('../../assets/images/cat9.png'),
  require('../../assets/images/cat10.png'),
]

// Order images
export const orderImages = [
  require('../../assets/images/order1.jpg'),
  require('../../assets/images/order2.jpg'),
  require('../../assets/images/order3.jpg'),
]

/**
 * Get a random restaurant placeholder image
 */
export const getRandomRestaurantImage = () => {
  return restaurantImages[Math.floor(Math.random() * restaurantImages.length)]
}

/**
 * Get a consistent restaurant image based on index
 */
export const getRestaurantImage = (index: number) => {
  return restaurantImages[index % restaurantImages.length]
}

/**
 * Get a random order image
 */
export const getRandomOrderImage = () => {
  return orderImages[Math.floor(Math.random() * orderImages.length)]
}

/**
 * Get a consistent order image based on index
 */
export const getOrderImage = (index: number) => {
  return orderImages[index % orderImages.length]
}
