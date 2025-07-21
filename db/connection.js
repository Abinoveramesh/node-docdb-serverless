const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.DOCDB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to DocumentDB");
    return client.db("abinovedb"); // Use your DB name
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
