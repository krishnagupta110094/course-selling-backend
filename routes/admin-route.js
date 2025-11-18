const express = require("express");
const { signup, signin } = require("../controllers/admin-auth-controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/course", () => {
  console.log("course route");
});
router.patch("/course", () => {
  console.log("course route");
});
router.get("/course/bulk", () => {
  console.log("course route");
});
module.exports = router;
