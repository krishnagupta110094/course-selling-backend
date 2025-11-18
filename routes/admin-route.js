const express = require("express");
const { signup, signin } = require("../controllers/admin-auth-controller");
const { adminAuth } = require("../middlewares/admin");
const { createCourse } = require("../controllers/admin-course");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/create-course", adminAuth, createCourse);
router.patch("/course", () => {
  console.log("course route");
});
router.get("/course/bulk", () => {
  console.log("course route");
});
module.exports = router;
