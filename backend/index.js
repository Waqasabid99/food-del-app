const express = require("express");
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db.con");

connectDB();

const app = express();

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));