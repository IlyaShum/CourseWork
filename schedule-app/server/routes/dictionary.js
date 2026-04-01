const express = require("express");
const router = express.Router();
const pool = require("../utils/database");

router.get("/subjects", async (req, res) => {
  const result = await pool.query("SELECT * FROM subjects");
  res.json(result.rows);
});

router.get("/teachers", async (req, res) => {
  const result = await pool.query("SELECT * FROM teachers");
  res.json(result.rows);
});

router.get("/groups", async (req, res) => {
  const result = await pool.query("SELECT * FROM groups");
  res.json(result.rows);
});

router.get("/rooms", async (req, res) => {
  const result = await pool.query("SELECT * FROM rooms");
  res.json(result.rows);
});

module.exports = router;