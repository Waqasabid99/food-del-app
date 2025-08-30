const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  menu_name: { type: String, required: true },
  menu_image: { type: String, required: true },
});

module.exports = mongoose.model("Menu", MenuSchema);
