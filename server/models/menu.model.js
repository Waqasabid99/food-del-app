const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isAvailable: {
        type: Boolean,
        required: false
    }
})

const MenuModel = mongoose.model.menu || mongoose.model("menu", MenuSchema);

module.exports = MenuModel;