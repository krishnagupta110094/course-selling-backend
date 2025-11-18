const express = require("express");
const router = express.Router();

router.post("/signup", () => {
  console.log("signup route");
});
router.post("/signin", () => {
  console.log("signin route");
});
router.post("/course", () => {
  console.log("course route");
});
module.exports = router;
