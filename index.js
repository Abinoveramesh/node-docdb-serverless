require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const awsServerlessExpress = require('aws-serverless-express');

const app = express();
const port = process.env.PORT || 3000;

let cachedClient = null;

async function connectToDatabase() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.DOCDB_URI, {
      tls: true,
      tlsCAFile: './rds-combined-ca-bundle.pem',
      serverSelectionTimeoutMS: 5000,
    });

    await cachedClient.connect();
    console.log('✅ Connected to DocumentDB');
  }

  return cachedClient.db('testdb');
}

// Express route
app.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('testCollection');
    const items = await collection.find({}).toArray();
    res.status(200).json({ items });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create server
const server = awsServerlessExpress.createServer(app);

// Export Lambda handler
exports.handler = (event, context) => {
  return awsServerlessExpress.proxy(server, event, context);
};
