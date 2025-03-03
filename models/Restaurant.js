const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  menu: [{ name: String, price: Number }],
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
