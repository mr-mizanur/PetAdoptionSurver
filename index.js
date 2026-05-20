//const express = require('express');
//const cors = require('cors');
//const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//require('dotenv').config();
//
//const app = express();
//
//app.use(cors({
//    origin: [
//        'https://pet-adoption-theta-ten.vercel.app',
//        'http://localhost:3000'
//    ],
//    credentials: true 
//}));
//app.use(express.json());
//
//const uri = process.env.DB_URI;
//
//const client = new MongoClient(uri, {
//  serverApi: {
//    version: ServerApiVersion.v1,
//    strict: true,
//    deprecationErrors: true,
//  }
//});
//
//let petsCollection, requestsCollection, wishlistCollection;
//
//async function connectDB() {
//    if (petsCollection) return; // অলরেডি কানেক্টেড থাকলে আর কানেক্ট করার দরকার নেই
//    try {
//        await client.connect();
//        const db = client.db("PetAdopt");
//        petsCollection = db.collection("pets");
//        requestsCollection = db.collection("adoptionrequests");
//        wishlistCollection = db.collection("wishlist");
//        console.log("Connected to MongoDB successfully!");
//    } catch (error) {
//        console.error("Database connection failed:", error);
//        throw error;
//    }
//}
//
//
//app.use(async (req, res, next) => {
//    try {
//        await connectDB();
//        next();
//    } catch (error) {
//        res.status(500).send({ message: "Database connection error" });
//    }
//});
//
//app.get('/', (req, res) => res.send('PetAdopt Engine Running...'));
//
//app.post('/api/pets', async (req, res) => {
//    const newPet = { ...req.body, status: 'available' };
//    const result = await petsCollection.insertOne(newPet);
//    res.send(result);
//});
//
//app.get('/api/pets', async (req, res) => {
//    const { search, species } = req.query;
//    let query = {};
//    if (search) query.name = { $regex: search, $options: 'i' };
//    if (species) query.species = { $in: species.split(',') };
//    
//    const result = await petsCollection.find(query).toArray();
//    res.send(result);
//});
//
//app.get('/api/pets/:id', async (req, res) => {
//    const result = await petsCollection.findOne({ _id: new ObjectId(req.params.id) });
//    res.send(result);
//});
//
//app.post('/api/wishlist', async (req, res) => {
//    const result = await wishlistCollection.insertOne(req.body);
//    res.send(result);
//});
//
//app.get('/api/wishlist/:email', async (req, res) => {
//    const result = await wishlistCollection.find({ userEmail: req.params.email }).toArray();
//    res.send(result);
//});
//
//app.post('/api/requests', async (req, res) => {
//    const newRequest = { ...req.body, status: 'pending' };
//    const result = await requestsCollection.insertOne(newRequest);
//    res.send(result);
//});
//
//
//
//
//
//app.get('/api/my-listings', async (req, res) => {
//    const email = req.query.email;
//    if (!email) return res.status(400).send({ message: "Email required" });
//    
//    const result = await petsCollection.find({ ownerEmail: email }).toArray();
//    res.send(result);
//});
//
//
//app.get('/api/owner-requests', async (req, res) => {
//    const email = req.query.email;
//    if (!email) return res.status(400).send({ message: "Email required" });
//
//    const myPets = await petsCollection.find({ ownerEmail: email }).project({ _id: 1 }).toArray();
//    const myPetIds = myPets.map(pet => pet._id.toString());
//
//   
//    const requests = await requestsCollection.find({ petId: { $in: myPetIds } }).toArray();
//    res.send(requests);
//});
//
//
//app.delete('/api/pets/:id', async (req, res) => {
//    const id = req.params.id;
//    const result = await petsCollection.deleteOne({ _id: new ObjectId(id) });
//    res.send(result);
//});
//
//
//app.patch('/api/requests/reject/:id', async (req, res) => {
//    const id = req.params.id;
//    const result = await requestsCollection.updateOne(
//        { _id: new ObjectId(id) },
//        { $set: { status: 'rejected' } }
//    );
//    res.send(result);
//});
//
//
//
//app.patch('/api/requests/approve/:id', async (req, res) => {
//    const targetRequest = await requestsCollection.findOne({ _id: new ObjectId(req.params.id) });
//    if (!targetRequest) return res.status(404).send({ message: "Not found" });
//
//    await requestsCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: 'approved' } });
//    await requestsCollection.updateMany({ petId: targetRequest.petId, _id: { $ne: new ObjectId(req.params.id) } }, { $set: { status: 'rejected' } });
//    await petsCollection.updateOne({ _id: new ObjectId(targetRequest.petId) }, { $set: { status: 'adopted' } });
//    
//    res.send({ success: true });
//});
//
//
//
//
//app.get('/api/my-requests', async (req, res) => {
//    const email = req.query.email;
//    if (!email) return res.status(400).send({ message: "Email required" });
//    
//    const requests = await requestsCollection.find({ requesterEmail: email }).toArray();
//    res.send(requests);
//});
//
//app.delete('/api/requests/:id', async (req, res) => {
//    const id = req.params.id;
//    const result = await requestsCollection.deleteOne({ _id: new ObjectId(id) });
//    if (result.deletedCount > 0) {
//        res.send({ success: true });
//    } else {
//        res.status(404).send({ message: "Request not found" });
//    }
//});
//
//
//
//app.get('/api/owner-stats', async (req, res) => {
//    const email = req.query.email;
//    const stats = await petsCollection.aggregate([
//        { $match: { ownerEmail: email } },
//        { $group: { 
//            _id: null, 
//            totalListings: { $sum: 1 },
//            availableCount: { $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] } },
//            adoptedCount: { $sum: { $cond: [{ $eq: ["$status", "adopted"] }, 1, 0] } }
//        }}
//    ]).toArray();
//    res.send(stats[0] || { totalListings: 0, availableCount: 0, adoptedCount: 0 });
//});
//
//module.exports = app




const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();

// CORS কনফিগারেশন: Credentials এবং নির্দিষ্ট Origin সেট করা
app.use(cors({
    origin: ['https://pet-adoption-theta-ten.vercel.app', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(cookieParser());

const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

// মিডলওয়্যার: ডাটা ব্লক চেক করা
const verifyToken = (req, res, next) => {
    // এখানে আপনার সেশন কুকি চেক করা হচ্ছে
    const sessionToken = req.cookies?.['__Secure-better-auth.session_token'];
    
    if (!sessionToken) {
        return res.status(401).send({ message: "Unauthorized: No session token found" });
    }
    next();
};

let petsCollection, requestsCollection, wishlistCollection;

async function connectDB() {
    if (petsCollection) return;
    try {
        await client.connect();
        const db = client.db("PetAdopt");
        petsCollection = db.collection("pets");
        requestsCollection = db.collection("adoptionrequests");
        wishlistCollection = db.collection("wishlist");
    } catch (error) { console.error(error); throw error; }
}

app.use(async (req, res, next) => { await connectDB(); next(); });

// রাউটস
app.get('/api/pets', async (req, res) => {
    const { search, species } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (species) query.species = { $in: species.split(',') };
    const result = await petsCollection.find(query).toArray();
    res.send(result);
});

app.post('/api/pets', verifyToken, async (req, res) => {
    const result = await petsCollection.insertOne({ ...req.body, status: 'available' });
    res.send(result);
});

app.get('/api/my-listings', verifyToken, async (req, res) => {
    const email = req.query.email;
    const result = await petsCollection.find({ ownerEmail: email }).toArray();
    res.send(result);
});

app.get('/api/owner-requests', verifyToken, async (req, res) => {
    const email = req.query.email;
    const myPets = await petsCollection.find({ ownerEmail: email }).project({ _id: 1 }).toArray();
    const myPetIds = myPets.map(pet => pet._id.toString());
    const requests = await requestsCollection.find({ petId: { $in: myPetIds } }).toArray();
    res.send(requests);
});

app.get('/api/my-requests', verifyToken, async (req, res) => {
    const email = req.query.email;
    const requests = await requestsCollection.find({ requesterEmail: email }).toArray();
    res.send(requests);
});

app.get('/', (req, res) => res.send('PetAdopt Engine Running...'));

module.exports = app;