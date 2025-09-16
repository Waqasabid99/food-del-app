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