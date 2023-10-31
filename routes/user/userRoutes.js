const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/userController");
const checkController = require("../../controllers/checkInOutController");
const validator = require("../../middleware/validateToken");

//admin role handler
// const adminHandler = require("../../middleware/roleHandler");
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/resetpassword", userController.resetPassword);
router.post("/forgotpassword", userController.forgotPassword);
router.get("/current", validator, userController.currentUser);
router.get("/allusers", validator, userController.getUser);
router.get("/:id", validator, userController.getUserById);
router.put(
  "/updatepassword/:id",
  //   adminHandler,
  validator,
  userController.UpdatePassword
);
router.get("/:id", userController.getUserById);

//Checks controllers

router.post("/checkin", validator, checkController.checkInUser);
router.post("/checkout", validator, checkController.checkOutuser);
router.get("/timelog/:id", validator, checkController.timeLogged);

module.exports = router;
