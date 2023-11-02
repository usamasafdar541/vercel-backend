const express = require("express");
const router = express.Router();
const multerMiddleware = require("../../middleware/fileupload/fileUpload");
const adminHandler = require("../../middleware/roleHandler");
const validateToken = require("../../middleware/validateToken");
const adminController = require("../../controllers/admin/adminController");

router.post("/registeradmin", adminController.addAdmin);
router.post(
  "/createuser",
  multerMiddleware,
  validateToken,
  adminHandler,
  adminController.createNewUser
);

module.exports = router;
router.post(
  "/deactivate/:id",
  adminHandler,
  validateToken,
  adminController.deactivateUser
);
router.post(
  "/activate/:id",
  adminHandler,
  validateToken,
  adminController.activateUser
);

router.put(
  "/update/:id",
  validateToken,
  adminHandler,
  adminController.updateUser
);

router.delete(
  "/delete/:id",
  validateToken,
  adminHandler,
  adminController.deleteUser
);

module.exports = router;
