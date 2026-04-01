const { Pool } = require("pg");

const pool = new Pool({
  user: "schedule_user",
  host: "localhost",
  database: "schedule_db",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

module.exports = pool;