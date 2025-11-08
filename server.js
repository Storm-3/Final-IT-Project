require("dotenv").config();
const db = require("./models");
const app = require("./app");

const PORT = process.env.PORT || 3000;

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