const pool = require("./utils/database")
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth")
const app = express();
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");
const scheduleRoutes = require("./routes/schedule");
const dictionaryRoutes = require("./routes/dictionary");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/dictionary", dictionaryRoutes);


app.get("/", (req, res) => {
    res.send("server working");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database error");
  }
});

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

