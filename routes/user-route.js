const express = require("express");
const { signup, signin } = require("../controllers/user-auth-controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/purchase", () => {
  console.log("purchase route");
});
module.exports = router;
