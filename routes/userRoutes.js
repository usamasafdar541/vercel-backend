const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkController = require("../controllers/checkInOutController");
const validatedToken = require("../middleware/validateTokenHandler");
router.post("/register", userController.createUser);
router.post("/createuser", userController.createNewUser);
router.post("/login", userController.loginUser);
router.post("/resetpassword", userController.resetPassword);
router.post("/forgotpassword", userController.forgotPassword);
router.get("/current", validatedToken, userController.currentUser);
router.get("/allusers", userController.getUser);
router.get("/:id", userController.getUserById);
// router.get("/:id", userController.singleUser);
router.put("/update/:id", userController.updateUser);
router.put(
  "/updatepassword/:id",
  validatedToken,
  userController.UpdatePassword
);
router.delete("/delete/:id", userController.deleteUser);

//Checks controllers

router.post("/checkin", validatedToken, checkController.checkInUser);
router.post("/checkout", validatedToken, checkController.checkOutuser);
router.get("/timelog/:id", validatedToken, checkController.timeLogged);

module.exports = router;
