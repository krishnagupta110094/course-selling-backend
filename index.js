const express = require("express");
const app = express();
const userRoute = require("./routes/user-route");
const courseRoute = require("./routes/course-route");
const adminRoute = require("./routes/admin-route");
const connectDB = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();

app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/admin", adminRoute);

app.listen(PORT, () => {
  console.log("Server is running on port: 3000");
});
