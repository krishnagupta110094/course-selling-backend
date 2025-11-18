const express = require("express");
const router = express.Router();

router.post("/purchase", () => {
  console.log("purchase route");
});
router.get("/preview", () => {
  console.log("preview route");
});
module.exports = router;
