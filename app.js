require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));


const userRoutes = require('./routes/userRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const messageRoutes = require("./routes/messageRoutes");
const roleRoutes = require("./routes/roleRoutes");

app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/roles', roleRoutes);
console.log("✅ roleRoutes mounted");

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

module.exports = app;

