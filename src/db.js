const { MongoClient } = require("mongodb");

let client;
let db;

async function connectToDB() {
  if (db) return db; // reuse existing connection

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "tedx_exhibition";

  if (!uri) {
    throw new Error("MONGODB_URI is not set in .env");
  }

  client = new MongoClient(uri);
  await client.connect();

  db = client.db(dbName);
  console.log("✅ Connected to MongoDB:", dbName);

  return db;
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDB() first.");
  }
  return db;
}

module.exports = {
  connectToDB,
  getDB,
};
