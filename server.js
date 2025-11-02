require("dotenv").config();
const express = require("express");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Import route files
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reportRoutes = require("./routes/reportRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const roleRoutes = require("./routes/roleRoutes");
const userRoutes = require("./routes/userRoutes");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Connected to Azure SQL successfully!");

    // Only sync after connection is confirmed
    await db.sequelize.sync();
    console.log("✅ Models synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1); // stop if DB connection fails
  }
}

startServer();
