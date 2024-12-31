import pg from "pg";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// CREATING EXPRESS SERVER
const app = express();
const port = process.env.SERVERPORT || 3000;

app.use(cors()); // Enable CORS for frontend integration
app.use(express.json()); // Middleware to parse JSON

// CONNECTION TO DATABASE
const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
});

db.connect();

let result; // Store the data globally

// Run the query only once at server start
db.query(
  `SELECT country,flag,capital
FROM capitals2
INNER JOIN flags2 ON capitals2.id = flags2.id;
`
)
  .then((res) => {
    result = res.rows;
    console.log("Data loaded successfully.");
    db.end();
  })
  .catch((error) => {
    console.error("Error executing query:", error);
    db.end();
  });

app.listen(port, () => {
  console.log("listening on port:", port);
});

app.get("/api/data", (req, res) => {
  try {
    const random = result[Math.floor(Math.random() * result.length)]; // Get a random item
    res.json(random);
  } catch (error) {
    console.error("Error fetching random data:", error);
    res.sendStatus(404);
  }
});
