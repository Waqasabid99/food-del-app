const express = require("express");
const foodRouter = express.Router();
// require('../uploads/food_images')
const foodService = require("../services/food.services");
const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads/foodImages"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: imageStorage });

foodRouter.post("/addfood", upload.single("image") , foodService.createFood)
foodRouter.get("/getfood", foodService.food_list)
foodRouter.get("/getfood/:id", foodService.findItem)
foodRouter.post("/deletefood/:id", foodService.deleteFood)


module.exports = foodRouter