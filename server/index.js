require("dotenv").config();
const express = require("express")
const PORT = process.env.PORT || 5000;
const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db-con");
const foodRouter = require("./routes/food.routes");
const menuRouter = require("./routes/menu.routes");
const path = require("path");
const userRouter = require("./routes/user.routes");
const orderRouter = require("./routes/order.routes");
const adminRouter = require("./routes/admin.routes");
const foodModel = require("./models/food.model");
const mongoose = require("mongoose");

const foods = [
  { name: "Greek salad", category: "Salad", price: 12, image: "food_1.png", isAvailable: true },
  { name: "Veg salad", category: "Salad", price: 18, image: "food_2.png", isAvailable: true },
  { name: "Clover Salad", category: "Salad", price: 16, image: "food_3.png", isAvailable: true },
  { name: "Chicken Salad", category: "Salad", price: 24, image: "food_4.png", isAvailable: true },

  { name: "Lasagna Rolls", category: "Rolls", price: 14, image: "food_5.png", isAvailable: true },
  { name: "Peri Peri Rolls", category: "Rolls", price: 12, image: "food_6.png", isAvailable: true },
  { name: "Chicken Rolls", category: "Rolls", price: 20, image: "food_7.png", isAvailable: true },
  { name: "Veg Rolls", category: "Rolls", price: 15, image: "food_8.png", isAvailable: true },

  { name: "Ripple Ice Cream", category: "Deserts", price: 14, image: "food_9.png", isAvailable: true },
  { name: "Fruit Ice Cream", category: "Deserts", price: 22, image: "food_10.png", isAvailable: true },
  { name: "Jar Ice Cream", category: "Deserts", price: 10, image: "food_11.png", isAvailable: true },
  { name: "Vanilla Ice Cream", category: "Deserts", price: 12, image: "food_12.png", isAvailable: true },

  { name: "Chicken Sandwich", category: "Sandwich", price: 12, image: "food_13.png", isAvailable: true },
  { name: "Vegan Sandwich", category: "Sandwich", price: 18, image: "food_14.png", isAvailable: true },
  { name: "Grilled Sandwich", category: "Sandwich", price: 16, image: "food_15.png", isAvailable: true },
  { name: "Bread Sandwich", category: "Sandwich", price: 24, image: "food_16.png", isAvailable: true },

  { name: "Cup Cake", category: "Cake", price: 14, image: "food_17.png", isAvailable: true },
  { name: "Vegan Cake", category: "Cake", price: 12, image: "food_18.png", isAvailable: true },
  { name: "Butterscotch Cake", category: "Cake", price: 20, image: "food_19.png", isAvailable: true },
  { name: "Sliced Cake", category: "Cake", price: 15, image: "food_20.png", isAvailable: true },

  { name: "Garlic Mushroom", category: "Pure Veg", price: 14, image: "food_21.png", isAvailable: true },
  { name: "Fried Cauliflower", category: "Pure Veg", price: 22, image: "food_22.png", isAvailable: true },
  { name: "Mix Veg Pulao", category: "Pure Veg", price: 10, image: "food_23.png", isAvailable: true },
  { name: "Rice Zucchini", category: "Pure Veg", price: 12, image: "food_24.png", isAvailable: true },

  { name: "Cheese Pasta", category: "Pasta", price: 12, image: "food_25.png", isAvailable: true },
  { name: "Tomato Pasta", category: "Pasta", price: 18, image: "food_26.png", isAvailable: true },
  { name: "Creamy Pasta", category: "Pasta", price: 16, image: "food_27.png", isAvailable: true },
  { name: "Chicken Pasta", category: "Pasta", price: 24, image: "food_28.png", isAvailable: true },

  { name: "Buttter Noodles", category: "Noodles", price: 14, image: "food_29.png", isAvailable: true },
  { name: "Veg Noodles", category: "Noodles", price: 12, image: "food_30.png", isAvailable: true },
  { name: "Somen Noodles", category: "Noodles", price: 20, image: "food_31.png", isAvailable: true },
  { name: "Cooked Noodles", category: "Noodles", price: 15, image: "food_32.png", isAvailable: true }
];


//Middleware
app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
   origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "https://food-del-frontend-apeu.onrender.com"],
   credentials: true
}))

//DB Connection
connectDB();
async function seedData() {
  try {
    await foodModel.insertMany(foods);
    console.log("✅ Foods inserted successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error inserting foods:", err);
    mongoose.connection.close();
  }
}

seedData();
//Routes
app.get('/', (req, res) => {
    res.send("Hello from the server")
})
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/api/menu", menuRouter)
app.use("/api/order", orderRouter)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/admin", adminRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})
