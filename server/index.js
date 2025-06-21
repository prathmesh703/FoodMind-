const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { router: authRouter } = require("./routes/auth");
const aiRoute = require("./routes/aiRoutes");
const profileRouter = require("./routes/profile");
const mealPlanRouter = require("./routes/mealPlan");

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongo db connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRouter);
app.use("/api/mealplan", aiRoute);
app.use("/api/user", profileRouter);
app.use("/api/savedmealplan", mealPlanRouter);

app.listen(port, () => console.log("server runnig on port 5000"));
