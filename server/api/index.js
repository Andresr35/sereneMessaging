var express = require("express");
var router = express.Router();

const userRouter = require("./user");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("Welcome to the API!");
});

router.use("/users", userRouter);

module.exports = router;
