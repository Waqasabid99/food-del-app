const MenuModel = require("../models/menu.model");
const fs = require("fs");
const path = require("path");

const createMenu = async (req, res) => {
  try {
    const image_name = `${req.file.filename}`;
    const menu_item = new MenuModel({
      name: req.body.name,
      image: image_name,
    });

    const savedItem = await menu_item.save();
    console.log({ success: true, data: savedItem });
    res.status(200).json({ success: true, data: savedItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const menu_list = async (req, res) => {
  try {
    const menu_items = await MenuModel.find({});
    console.log({ success: true, data: menu_items });
    res.status(200).json({ success: true, data: menu_items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const findMenu = async (req, res) => {
  try {
    const menu_item = await MenuModel.findById(req.params.id);

    console.log({ success: true, data: menu_item });
    res.status(200).json({ success: true, data: menu_item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const delete_menu = async (req, res) => {
  try {
    const deletedItem = await MenuModel.findByIdAndDelete(req.params.id);

    // Safely delete associated image if it exists
    if (deletedItem.image) {
      fs.unlink(
        path.join(__dirname, "../uploads/menuImages", deletedItem.image),
        (err) => {
          if (err) console.error("File deletion error:", err);
        }
      );
    }

    console.log({ success: true, message: "Deleted successfully" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createMenu,
  menu_list,
  findMenu,
  delete_menu,
};
