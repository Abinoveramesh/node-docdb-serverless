require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
let db;

// Connect to DocumentDB
async function connectToDB() {
  const client = new MongoClient(process.env.DOCDB_URI, {
    ssl: true,
    useUnifiedTopology: true,
    tlsAllowInvalidCertificates: true, // Optional: if your certs aren't valid
  });

  try {
    await client.connect();
    console.log('✅ Connected to DocumentDB');
    db = client.db('docdbdemo');
  } catch (err) {
    console.error('❌ Failed to connect to DocumentDB', err);
  }
}

// Sample API
app.get('/items', async (req, res) => {
  try {
    const items = await db.collection('items').find().toArray();
    res.json(items);
  } catch (err) {
    res.status(500).send('Error fetching items');
  }
});

app.post('/items', async (req, res) => {
  try {
    const result = await db.collection('items').insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send('Error inserting item');
  }
});

// Start server after DB connection
connectToDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
});
