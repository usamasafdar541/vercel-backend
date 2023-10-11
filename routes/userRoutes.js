const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validatedToken = require("../middleware/validateTokenHandler");
router.post("/register", userController.createUser);
router.post("/createuser",validatedToken, userController.createNewUser);
router.post("/login", userController.loginUser);
router.post("/resetpassword", userController.resetPassword);
router.post("/forgotpassword", userController.forgotPassword);
router.get("/current", validatedToken, userController.currentUser);
router.get("/allusers", userController.getUser);
router.get("/:id", userController.getUserById);
// router.get("/:id", userController.singleUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
