const express = require("express");
const router = express.Router();
const pool = require("../utils/database");
const authMiddleware = require("../middleware/authMiddleware");


// создать расписание (только админ)
router.post("/", authMiddleware, async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only admin can create schedule"
    });
  }

  try {

    const { subject_id, teacher_id, room_id, group_id, day, time } = req.body;

    const result = await pool.query(
      `INSERT INTO schedule 
      (subject_id, teacher_id, room_id, group_id, day, time)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [subject_id, teacher_id, room_id, group_id, day, time]
    );

    res.json({
      message: "Schedule created",
      schedule: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }

});


// получить расписание (все пользователи)
router.get("/", authMiddleware, async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        schedule.id,
        schedule.subject_id,
        schedule.teacher_id,
        schedule.room_id,
        schedule.group_id,
        subjects.name AS subject,
        teachers.name AS teacher,
        rooms.number AS room,
        groups.name AS group_name,
        schedule.day,
        schedule.time
      FROM schedule
      JOIN subjects ON schedule.subject_id = subjects.id
      JOIN teachers ON schedule.teacher_id = teachers.id
      JOIN rooms ON schedule.room_id = rooms.id
      JOIN groups ON schedule.group_id = groups.id
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }

});

// удалить занятие (только админ)
router.delete("/:id", authMiddleware, async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only admin can delete schedule"
    });
  }

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM schedule WHERE id = $1",
      [id]
    );

    res.json({
      message: "Schedule deleted"
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }

});

// обновить занятие (только админ)
router.put("/:id", authMiddleware, async (req, res) => {

  const { subject_id, teacher_id, room_id, group_id, day, time } = req.body;
  const id = req.params.id;

  try {

    await pool.query(
      `
      UPDATE schedule
      SET subject_id=$1,
          teacher_id=$2,
          room_id=$3,
          group_id=$4,
          day=$5,
          time=$6
      WHERE id=$7
      `,
      [subject_id, teacher_id, room_id, group_id, day, time, id]
    );

    res.json({ message: "Lesson updated" });

  } catch (err) {

    console.error(err);
    res.status(500).send("Server error");

  }

});

module.exports = router;