require('dotenv').config();
const mongoose = require('mongoose')

const connectDB = async () => {
    mongoose.connect(process.env.DB_URL).then(() => {
        console.log("Database connected");
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = connectDB;