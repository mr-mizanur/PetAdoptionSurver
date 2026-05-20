const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();


app.use(cors({
    origin: [
        'https://pet-adoption-theta-ten.vercel.app',
        'http://localhost:3000'
    ],
    credentials: true 
}));
app.use(express.json());

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


let petsCollection, requestsCollection, wishlistCollection;

async function connectDB() {
    try {
        await client.connect();
        const db = client.db("PetAdopt");
        petsCollection = db.collection("pets");
        requestsCollection = db.collection("adoptionrequests");
        wishlistCollection = db.collection("wishlist");
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}


connectDB();



app.get('/', (req, res) => res.send('PetAdopt Engine Running...'));

app.post('/api/pets', async (req, res) => {
    const newPet = { ...req.body, status: 'available' };
    const result = await petsCollection.insertOne(newPet);
    res.send(result);
});

app.get('/api/pets', async (req, res) => {
    const { search, species } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (species) query.species = { $in: species.split(',') };
    
    const result = await petsCollection.find(query).toArray();
    res.send(result);
});

app.get('/api/pets/:id', async (req, res) => {
    const result = await petsCollection.findOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
});

app.post('/api/wishlist', async (req, res) => {
    const result = await wishlistCollection.insertOne(req.body);
    res.send(result);
});

app.get('/api/wishlist/:email', async (req, res) => {
    const result = await wishlistCollection.find({ userEmail: req.params.email }).toArray();
    res.send(result);
});


app.post('/api/requests', async (req, res) => {
    const newRequest = { ...req.body, status: 'pending' };
    const result = await requestsCollection.insertOne(newRequest);
    res.send(result);
});

app.patch('/api/requests/approve/:id', async (req, res) => {
    const targetRequest = await requestsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!targetRequest) return res.status(404).send({ message: "Not found" });

    await requestsCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: 'approved' } });
    await requestsCollection.updateMany({ petId: targetRequest.petId, _id: { $ne: new ObjectId(req.params.id) } }, { $set: { status: 'rejected' } });
    await petsCollection.updateOne({ _id: new ObjectId(targetRequest.petId) }, { $set: { status: 'adopted' } });
    
    res.send({ success: true });
});


app.get('/api/owner-stats', async (req, res) => {
    const email = req.query.email;
    const stats = await petsCollection.aggregate([
        { $match: { ownerEmail: email } },
        { $group: { 
            _id: null, 
            totalListings: { $sum: 1 },
            availableCount: { $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] } },
            adoptedCount: { $sum: { $cond: [{ $eq: ["$status", "adopted"] }, 1, 0] } }
        }}
    ]).toArray();
    res.send(stats[0] || { totalListings: 0, availableCount: 0, adoptedCount: 0 });
});

module.exports = app;





//all