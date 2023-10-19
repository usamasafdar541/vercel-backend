const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkController = require("../controllers/checkInOutController");
const validator = require("../middleware/validateToken");
//admin role handler
const adminHandler = require("../middleware/roleHandler");
router.post("/register", userController.createUser);
router.post("/register/admin", adminHandler, userController.addAdmin);
router.post("/createuser", adminHandler, userController.createNewUser);
router.post("/login", userController.loginUser);
router.post("/resetpassword", userController.resetPassword);
router.post("/forgotpassword", userController.forgotPassword);
router.get("/current", validator, userController.currentUser);
router.get("/allusers",validator, userController.getUser);
router.get("/:id",validator, userController.getUserById);
// router.get("/:id", userController.getUserById);
router.post(
  "/deactivate/:id",
  adminHandler,
  validator,
  userController.deactivateUser
);
router.post(
  "/activate/:id",
  adminHandler,
  validator,
  userController.activateUser
);

// router.get("/:id", userController.singleUser);
router.put("/update/:id", adminHandler, userController.updateUser);
router.put(
  "/updatepassword/:id",
//   adminHandler,
  validator,
  userController.UpdatePassword
);
router.delete("/delete/:id",validator, adminHandler, userController.deleteUser);

//Checks controllers

router.post("/checkin", validator, checkController.checkInUser);
router.post("/checkout", validator, checkController.checkOutuser);
router.get("/timelog/:id", validator, checkController.timeLogged);

module.exports = router;
