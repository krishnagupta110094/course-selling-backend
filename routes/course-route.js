const express = require("express");
const { getAllCourses } = require("../controllers/course");
const router = express.Router();


router.get("/preview", getAllCourses);
module.exports = router;
