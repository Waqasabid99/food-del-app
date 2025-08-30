const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
  food_list: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],
  menu_list: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
});

module.exports = mongoose.model("Shop", ShopSchema);
