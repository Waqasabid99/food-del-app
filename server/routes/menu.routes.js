const path = require("path");
const express = require("express");
const menuRouter = express.Router();
const menuService = require("../services/menu.services");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../uploads/menuImages"),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage });

menuRouter.post("/addmenu", upload.single("image") , menuService.createMenu)
menuRouter.get("/getmenu", menuService.menu_list)
menuRouter.get("/getmenu/:id", menuService.findMenu)
menuRouter.post("/deletemenu/:id", menuService.delete_menu)
module.exports = menuRouter