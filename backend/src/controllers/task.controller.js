const asyncHandler = require("express-async-handler");
const Task = require("../models/task.model");
const openai = require("../utils/openaiClient");

// @desc Get all tasks
// @route GET /api/tasks
exports.getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, tasks });
});

// @desc Create a new task
// @route POST /api/tasks
exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: "Title is required" });
  }

  const task = await Task.create({ title, description, priority, dueDate });
  res.status(201).json({ success: true, task });
});

// @desc Get AI suggestions for task improvement
// @route POST /api/tasks/ai-suggest
exports.getAISuggestions = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title && !description) {
    return res.status(400).json({ success: false, message: "Title or description is required" });
  }

  const prompt = `
You are an intelligent task management assistant.
Given the task below, suggest 3 short, actionable improvements or sub-tasks.

Task:
${title ? `Title: ${title}` : ""}
${description ? `Description: ${description}` : ""}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant for productivity and task management." },
      { role: "user", content: prompt },
    ],
    max_tokens: 100,
  });

  const aiText = response.choices?.[0]?.message?.content || "No suggestions generated.";

  const suggestions = aiText
    .split("\n")
    .map((s) => s.replace(/^\d+\.\s*/, "").trim())
    .filter((s) => s);

  res.status(200).json({ success: true, suggestions });
});

// @desc Update a task
// @route PUT /api/tasks/:id
exports.updateTask = asyncHandler(async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedTask) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }
  res.status(200).json({ success: true, updatedTask });
});

// @desc Delete a task
// @route DELETE /api/tasks/:id
exports.deleteTask = asyncHandler(async (req, res) => {
  const deletedTask = await Task.findByIdAndDelete(req.params.id);
  if (!deletedTask) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }
  res.status(200).json({ success: true, message: "Task deleted successfully" });
});
