const express = require("express")
const userRouter = express.Router()
const userService = require("../services/user.services")
const userAuth = require("../middleware/auth")

userRouter.post("/register", userService.createUser)
userRouter.post("/login", userService.loginUser)
userRouter.post("/logout", userService.logoutUser)
userRouter.get("/getuser/:id", userAuth.verifyToken, userService.getUserById)
userRouter.put("/update/:id", userAuth.verifyToken, userService.updateUser)
module.exports = userRouter