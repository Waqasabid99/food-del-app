const MenuModel = require("../models/menu.model");
const fs = require("fs");
const path = require("path");

const createMenu = async (req, res) => {
  try {
    const image_name = `${req.file.filename}`;
    const menu_item = new MenuModel({
      name: req.body.name,
      image: image_name
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
        res.json({ status: 200, data: menu_items });
        console.log({ status: 200, data: menu_items });
    } catch (err) {
        res.json({ status: 500, data: err });
        console.log({ status: 500, data: err });
    }
}

const findMenu = async (req, res) => {
    try {
        const menu_item = await MenuModel.findById(req.params.id);
        res.json({ status: 200, data: menu_item });
        console.log({ status: 200, data: menu_item });
    } catch (err) {
        res.json({ status: 500, data: err });
        console.log({ status: 500, data: err });
    }
}

const delete_menu = async (req, res) => {
    try {
        await MenuModel.findByIdAndDelete(req.params.id);
        fs.unlink(path.join(__dirname, "../uploads/menuImages", req.body.image), (err) => {
            if (err) console.error("File deletion error:", err);
        })
        res.json({ status: 200, data: "Deleted" });
        console.log({ status: 200, data: "Deleted" });
    } catch (error) {
        res.json({ status: 500, data: error });
        console.log({ status: 500, data: error });
    }
}

module.exports = {
    createMenu,
    menu_list,
    findMenu,
    delete_menu
}