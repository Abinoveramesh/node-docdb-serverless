require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connection");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Node.js app connected to DocumentDB!");
});

app.get("/users", async (req, res) => {
  const db = await connectDB();
  const users = await db.collection("users").find().toArray();
  res.json(users);
});

app.listen(port, () => {
  console.log(`🟢 Server running on http://localhost:${port}`);
});
