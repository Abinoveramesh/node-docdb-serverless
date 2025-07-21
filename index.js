require("dotenv").config();
const express = require("express");
const awsServerlessExpress = require("aws-serverless-express");
const connectDB = require("./db/connection");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Node.js app connected to DocumentDB!");
});

app.get("/users", async (req, res) => {
  const db = await connectDB();
  const users = await db.collection("users").find().toArray();
  res.json(users);
});

// Create the server for AWS Lambda
const server = awsServerlessExpress.createServer(app);

// This is what Lambda looks for: `handler`
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
