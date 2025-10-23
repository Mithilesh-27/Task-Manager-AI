const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./db/connect.db");
const cors = require("cors");
require("colors");
const taskRoutes = require("./routes/task.routes");

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use("/api/tasks", taskRoutes);

// Simple health check route
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server and DB running fine!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
