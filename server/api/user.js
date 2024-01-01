var express = require("express");
var router = express.Router();
const {
  signUp,
  logIn,
  getUserMessages,
  createMessage,
} = require("../controllers/userController");

router.post("/signUp", signUp);
router.post("/logIn", logIn);
router.get("/:userID/messages", getUserMessages);
router.post("/:userID/message", createMessage);

module.exports = router;
