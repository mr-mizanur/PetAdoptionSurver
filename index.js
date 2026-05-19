const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// --- মিডলওয়্যার কনফিগারেশন ---
app.use(cors({
    origin: [
        'http://localhost:3000', 
    ],
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uaz5xk0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
  
    const db = client.db("petAdoptionDB");
    const petsCollection = db.collection("pets");
    const requestsCollection = db.collection("requests");

    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. successfully connected to MongoDB!");

    app.get('/', (req, res) => {
        res.send('running...');
    });

  } catch (error) {
    console.error("error:", error);
  }
  
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Run on: ${port}-এ`);
});