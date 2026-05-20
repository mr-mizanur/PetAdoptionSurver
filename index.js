//const express = require('express');
//const cors = require('cors');
//const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//require('dotenv').config();
//
//const app = express();
//const port = process.env.PORT || 5000;
//
//app.use(cors({
//    origin: [
//        'http://localhost:3000',
//    ],
//    credentials: true 
//}));
//app.use(express.json());
//
//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uaz5xk0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//
//const client = new MongoClient(uri, {
//  serverApi: {
//    version: ServerApiVersion.v1,
//    strict: true,
//    deprecationErrors: true,
//  }
//});
//
//async function run() {
//  try {
//    const db = client.db("PetAdopt");
//    const petsCollection = db.collection("pets");
//    const requestsCollection = db.collection("adoptionrequests");
//
//    await client.db("admin").command({ ping: 1 });
//    console.log("Pinged your deployment. successfully connected to MongoDB!");
//
//    app.post('/api/pets', async (req, res) => {
//        try {
//            const petData = req.body;
//            const newPet = { ...petData, status: 'available' };
//            const result = await petsCollection.insertOne(newPet);
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.get('/api/pets', async (req, res) => {
//        try {
//            const { search, species } = req.query;
//            let query = {};
//
//            if (search) {
//                query.name = { $regex: search, $options: 'i' };
//            }
//            if (species) {
//                const speciesArray = species.split(',');
//                query.species = { $in: speciesArray };
//            }
//
//            const result = await petsCollection.find(query).toArray();
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.get('/api/pets/:id', async (req, res) => {
//        try {
//            const id = req.params.id;
//            const result = await petsCollection.findOne({ _id: new ObjectId(id) });
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.put('/api/pets/:id', async (req, res) => {
//        try {
//            const id = req.params.id;
//            const updatedData = req.body;
//            delete updatedData._id; 
//            const result = await petsCollection.updateOne(
//                { _id: new ObjectId(id) },
//                { $set: updatedData }
//            );
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.delete('/api/pets/:id', async (req, res) => {
//        try {
//            const id = req.params.id;
//            const result = await petsCollection.deleteOne({ _id: new ObjectId(id) });
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.post('/api/requests', async (req, res) => {
//        try {
//            const requestData = req.body;
//            const newRequest = { ...requestData, status: 'pending' };
//            const result = await requestsCollection.insertOne(newRequest);
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.get('/api/my-requests', async (req, res) => {
//        try {
//            const email = req.query.email;
//            if (!email) return res.status(400).send({ message: 'Email required' });
//            const result = await requestsCollection.find({ requesterEmail: email }).toArray();
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.get('/api/owner-requests', async (req, res) => {
//        try {
//            const email = req.query.email;
//            if (!email) return res.status(400).send({ message: 'Owner email required' });
//            const result = await requestsCollection.find({ ownerEmail: email }).toArray();
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.delete('/api/requests/:id', async (req, res) => {
//        try {
//            const id = req.params.id;
//            const result = await requestsCollection.deleteOne({ _id: new ObjectId(id) });
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.patch('/api/requests/approve/:id', async (req, res) => {
//        try {
//            const requestId = req.params.id;
//            const targetRequest = await requestsCollection.findOne({ _id: new ObjectId(requestId) });
//            if (!targetRequest) return res.status(404).send({ message: 'Request not found' });
//
//            const petId = targetRequest.petId;
//
//            await requestsCollection.updateOne(
//                { _id: new ObjectId(requestId) },
//                { $set: { status: 'approved' } }
//            );
//
//            await requestsCollection.updateMany(
//                { petId: petId, _id: { $ne: new ObjectId(requestId) }, status: 'pending' },
//                { $set: { status: 'rejected' } }
//            );
//
//            await petsCollection.updateOne(
//                { _id: new ObjectId(petId) },
//                { $set: { status: 'adopted' } }
//            );
//
//            res.send({ success: true, message: 'Adoption approved and other requests rejected!' });
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.patch('/api/requests/reject/:id', async (req, res) => {
//        try {
//            const requestId = req.params.id;
//            const result = await requestsCollection.updateOne(
//                { _id: new ObjectId(requestId) },
//                { $set: { status: 'rejected' } }
//            );
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.get('/', (req, res) => {
//        res.send('running...');
//    });
//
//  } catch (error) {
//    console.error("error:", error);
//  }
//}
//run().catch(console.dir);
//
//app.listen(port, () => {
//    console.log(`Run on: ${port}`);
//});

















//
//
//const express = require('express');
//const cors = require('cors');
//const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//require('dotenv').config();
//
//const app = express();
//const port = process.env.PORT || 5000;
//
//app.use(cors({
//   origin: [
//        'https://pet-adoption-g53n.vercel.app',
//        'http://localhost:3000'
//    ],
//    credentials: true 
//}));
//app.use(express.json());
//
//const uri = process.env.DB_URI ;
//
//const client = new MongoClient(uri, {
//  serverApi: {
//    version: ServerApiVersion.v1,
//    strict: true,
//    deprecationErrors: true,
//  }
//});
//
//app.get('/', (req, res) => {
//    res.send('Matrix PetAdopt Core Engine Running...');
//});
//
//async function run() {
//  try {
//    const db = client.db("PetAdopt");
//    const petsCollection = db.collection("pets");
//    const requestsCollection = db.collection("adoptionrequests");
//
//    await client.db("admin").command({ ping: 1 });
//    console.log("Pinged your deployment. successfully connected to MongoDB!");
//
//    app.post('/api/pets', async (req, res) => {
//        try {
//            const petData = req.body;
//            const newPet = { ...petData, status: 'available' };
//            const result = await petsCollection.insertOne(newPet);
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.get('/api/pets', async (req, res) => {
//        try {
//            const { search, species } = req.query;
//            let query = {};
//
//            if (search) {
//                query.name = { $regex: search, $options: 'i' };
//            }
//            if (species) {
//                const speciesArray = species.split(',');
//                query.species = { $in: speciesArray };
//            }
//
//            const result = await petsCollection.find(query).toArray();
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.get('/api/my-listings', async (req, res) => {
//        try {
//            const email = req.query.email;
//            if (!email) return res.status(400).send({ message: 'Owner email query parameter is required' });
//            const result = await petsCollection.find({ ownerEmail: email }).toArray();
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.get('/api/owner-stats', async (req, res) => {
//        try {
//            const email = req.query.email;
//            if (!email) return res.status(400).send({ message: 'Owner email query parameter is required' });
//            
//            const totalListings = await petsCollection.countDocuments({ ownerEmail: email });
//            const availableCount = await petsCollection.countDocuments({ ownerEmail: email, status: 'available' });
//            const adoptedCount = await petsCollection.countDocuments({ ownerEmail: email, status: 'adopted' });
//
//            res.send({ totalListings, availableCount, adoptedCount });
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.get('/api/pets/:id', async (req, res) => {
//        try {
//            const id = req.params.id;
//            const result = await petsCollection.findOne({ _id: new ObjectId(id) });
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.put('/api/pets/:id', async (req, res) => {
//        try {
//            const id = req.params.id;
//            const updatedData = req.body;
//            delete updatedData._id; 
//            const result = await petsCollection.updateOne(
//                { _id: new ObjectId(id) },
//                { $set: updatedData }
//            );
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.delete('/api/pets/:id', async (req, res) => {
//        try {
//            const id = req.params.id;
//            const result = await petsCollection.deleteOne({ _id: new ObjectId(id) });
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.post('/api/requests', async (req, res) => {
//        try {
//            const requestData = req.body;
//            const newRequest = { ...requestData, status: 'pending' };
//            const result = await requestsCollection.insertOne(newRequest);
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.get('/api/my-requests', async (req, res) => {
//        try {
//            const email = req.query.email;
//            if (!email) return res.status(400).send({ message: 'Email required' });
//            const result = await requestsCollection.find({ requesterEmail: email }).toArray();
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.get('/api/owner-requests', async (req, res) => {
//        try {
//            const email = req.query.email;
//            if (!email) return res.status(400).send({ message: 'Owner email required' });
//            const result = await requestsCollection.find({ ownerEmail: email }).toArray();
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.delete('/api/requests/:id', async (req, res) => {
//        try {
//            const id = req.params.id;
//            const result = await requestsCollection.deleteOne({ _id: new ObjectId(id) });
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.patch('/api/requests/approve/:id', async (req, res) => {
//        try {
//            const requestId = req.params.id;
//            const targetRequest = await requestsCollection.findOne({ _id: new ObjectId(requestId) });
//            if (!targetRequest) return res.status(404).send({ message: 'Target request pipeline record not found' });
//
//            const petId = targetRequest.petId;
//
//            await requestsCollection.updateOne(
//                { _id: new ObjectId(requestId) },
//                { $set: { status: 'approved' } }
//            );
//
//            await requestsCollection.updateMany(
//                { petId: petId, _id: { $ne: new ObjectId(requestId) }, status: 'pending' },
//                { $set: { status: 'rejected' } }
//            );
//
//            await petsCollection.updateOne(
//                { _id: new ObjectId(petId) },
//                { $set: { status: 'adopted' } }
//            );
//
//            res.send({ success: true, message: 'Adoption approved and other requests rejected!' });
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//    app.patch('/api/requests/reject/:id', async (req, res) => {
//        try {
//            const requestId = req.params.id;
//            const result = await requestsCollection.updateOne(
//                { _id: new ObjectId(requestId) },
//                { $set: { status: 'rejected' } }
//            );
//            res.send(result);
//        } catch (error) {
//            res.status(500).send({ message: error.message });
//        }
//    });
//
//  } catch (error) {
//    console.error("error:", error);
//  }
//}
//run().catch(console.dir);
//
//app.listen(port, () => {
//    console.log(`Run on: ${port}`);
//});
//
//
//module.exports = app;

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();

// CORS Configuration
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

async function run() {
  try {
    await client.connect();
    const db = client.db("PetAdopt");
    
    // কালেকশনগুলো আগে ডিফাইন করে নেওয়া
    const petsCollection = db.collection("pets");
    const requestsCollection = db.collection("adoptionrequests");
    const wishlistCollection = db.collection("wishlist");

    console.log("Connected to MongoDB successfully!");

    // --- Routes ---

    // Pets Routes
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

    // Wishlist Routes
    app.post('/api/wishlist', async (req, res) => {
        const { userEmail, petId } = req.body;
        const result = await wishlistCollection.insertOne({ userEmail, petId });
        res.send(result);
    });
    
    app.get('/api/wishlist/:email', async (req, res) => {
        const result = await wishlistCollection.find({ userEmail: req.params.email }).toArray();
        res.send(result);
    });

    // Request Routes
    app.post('/api/requests', async (req, res) => {
        const newRequest = { ...req.body, status: 'pending' };
        const result = await requestsCollection.insertOne(newRequest);
        res.send(result);
    });

    app.patch('/api/requests/approve/:id', async (req, res) => {
        const targetRequest = await requestsCollection.findOne({ _id: new ObjectId(req.params.id) });
        
        // ১. রিকোয়েস্ট অ্যাপ্রুভ করা
        await requestsCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: 'approved' } });
        // ২. বাকিগুলো রিজেক্ট করা
        await requestsCollection.updateMany({ petId: targetRequest.petId, _id: { $ne: new ObjectId(req.params.id) } }, { $set: { status: 'rejected' } });
        // ৩. পেটের স্ট্যাটাস আপডেট
        await petsCollection.updateOne({ _id: new ObjectId(targetRequest.petId) }, { $set: { status: 'adopted' } });
        
        res.send({ success: true });
    });

    // Owner Stats & Listings
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

  } catch (error) {
    console.error("Database Error:", error);
  }
}

run();

app.get('/', (req, res) => res.send('PetAdopt Engine Running...'));

module.exports = app;