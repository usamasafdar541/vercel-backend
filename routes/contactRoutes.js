const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
// const validateToken = require("../middleware/validateTokenHandler");
// router.use(validateToken);
router.post("/", contactController.createContact);
router.get("/", contactController.getAllContacts);
router.get("/:id", contactController.getSingleContact);
router.put("/:id", contactController.updateContact);
router.delete("/:id", contactController.deleteContact);

module.exports = router;
