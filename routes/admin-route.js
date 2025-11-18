const express = require("express");
const { signup, signin } = require("../controllers/admin-auth-controller");
const { adminAuth } = require("../middlewares/admin");
const { createCourse, updateCourse, getAdminCourses, deleteCourse } = require("../controllers/admin-course");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/create-course", adminAuth, createCourse);
router.patch("/update-course/:id", adminAuth, updateCourse);
router.get("/courses", adminAuth, getAdminCourses);
router.delete("/course/:id",adminAuth,deleteCourse);
module.exports = router;
