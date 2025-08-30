const foodModel = require("../models/food.model");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const createFood = async (req, res) => {
    let image_name = `${req.file.filename}`;
    const food_item = new foodModel({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        image: image_name,
        isAvailable: req.body.isAvailable
    })
    try {
        const savedItem = await food_item.save();
        res.json({ status: 200, data: savedItem });
        console.log({ status: 200, data: savedItem });
    } catch (err) {
        res.json({ status: 500, data: err });
        console.log({ status: 500, data: err });
    }
}

const food_list = async (req, res) => {
    try {
        const food_items = await foodModel.find({});
        res.json({ status: 200, data: food_items });
        console.log({ status: 200, data: food_items });
    } catch (err) {
        res.json({ status: 500, data: err });
        console.log({ status: 500, data: err });
    }
}

const findItem = async (req, res) => {
    try {
        const food_item = await foodModel.findById(req.params.id);
        res.json({ status: 200, data: food_item });
        console.log({ status: 200, data: food_item });
    } catch (err) {
        res.json({ status: 500, data: err });
        console.log({ status: 500, data: err });
    }
}

const deleteFood = async (req, res) => {
    try {
        const food_item = await foodModel.findById(req.params.id)
        fs.unlink(path.join(__dirname, "../uploads/foodImages", food_item.image), (err) => {
            if (err) console.error("File deletion error:", err);
        });
        await foodModel.findByIdAndDelete(req.params.id);
        res.json({ status: 200, data: "Deleted" });
        console.log({ status: 200, data: "Deleted" });
    } catch (error) {
        res.json({ status: 500, data: error });
        console.log({ status: 500, data: error });
    }
}

module.exports = { createFood, food_list, findItem, deleteFood }