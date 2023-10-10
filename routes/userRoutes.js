const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validatedToken = require("../middleware/validateTokenHandler");
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/current", validatedToken, userController.currentUser);
router.get("/:id", userController.singleUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
