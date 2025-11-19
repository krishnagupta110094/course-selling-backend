const express = require("express");
const { signup, signin } = require("../controllers/user-auth-controller");
const { userAuth } = require("../middlewares/user");
const { buyCourse } = require("../controllers/course");
const { getUserPurchasedCourses } = require("../controllers/user-course");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/purchase/:id", userAuth , buyCourse);
router.get("/courses",userAuth,getUserPurchasedCourses);
module.exports = router;
