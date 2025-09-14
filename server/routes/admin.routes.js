const express = require("express");
const { loginAdmin } = require("../services/admin.services");
const adminRouter = express.Router();
const adminService = require("../services/admin.services");


adminRouter.post('/register', adminService.createAdmin);
adminRouter.post('/login', adminService.loginAdmin);
adminRouter.get('/getuser/:id', adminService.getAdminById);
adminRouter.get('/getall', adminService.getAllAdmins);
adminRouter.put('/update/:id', adminService.updateAdmin);
adminRouter.get('/logout', adminService.logoutAdmin);


module.exports = adminRouter