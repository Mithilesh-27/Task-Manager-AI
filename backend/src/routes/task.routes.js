const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  getAISuggestions,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

router.get("/", getTasks);
router.post("/", createTask);
router.post("/ai-suggest", getAISuggestions);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
