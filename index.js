const { MongoClient } = require("mongodb");

const uri = process.env.DOCDB_URI;
let cachedClient = null;

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      tls: true,
      tlsCAFile: './rds-combined-ca-bundle.pem', // Remove this if not needed
      serverSelectionTimeoutMS: 5000
    });

    await cachedClient.connect();
    console.log("✅ Connected to DocumentDB");
  }

  const db = cachedClient.db("testdb");
  const collection = db.collection("testCollection");

  const items = await collection.find({}).toArray();

  return {
    statusCode: 200,
    body: JSON.stringify({ items }),
    headers: {
      "Content-Type": "application/json"
    }
  };
};
