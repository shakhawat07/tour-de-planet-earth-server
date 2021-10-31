const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vbla2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('Database connected');
        const database = client.db('tourDePlanetEarth');
        const tourPackagesCollection = database.collection('tourPackages');
        const teamMembersCollection = database.collection('teamMembers');
        const tourCategoriesCollection = database.collection('tourCategories');
        const ordersCollection = database.collection('orders');

        // GET API OF TOUR PACKAGES
        app.get('/tourPackages', async (req, res) => {
            const cursor = tourPackagesCollection.find({});
            const tourPackages = await cursor.toArray();
            res.send(tourPackages);
        });

        // GET SINGLE TOUR PACKAGE
        app.get('/tourPackages/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting specific tour package', id);
            const query = { _id: ObjectId(id) };
            const tourPackage = await tourPackagesCollection.findOne(query);
            res.json(tourPackage);
        });

        // GET API OF TEAM MEMBERS
        app.get('/teamMembers', async (req, res) => {
            const cursor = teamMembersCollection.find({});
            const teamMembers = await cursor.toArray();
            res.send(teamMembers);
        });

        // GET API OF TOUR CATEGORIES
        app.get('/tourCategories', async (req, res) => {
            const cursor = tourCategoriesCollection.find({});
            const tourCategories = await cursor.toArray();
            res.send(tourCategories);
        });

        // GET API OF ADD ORDERS
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // GET SINGLE ORDER
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting specific order', id);
            const query = { _id: ObjectId(id) };
            const order = await ordersCollection.findOne(query);
            res.json(order);
        });

        // POST API TOUR PACKAGES
        app.post('/tourPackages', async (req, res) => {
            const tourCategory = req.body;
            console.log('hit the post api', tourCategory);

            const result = await tourPackagesCollection.insertOne(tourCategory);
            console.log(result);
            res.json(result)
        });

        // POST API ADD ORDERS
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        });

        // DELETE API SINGLE ORDER
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        });
        //UPDATE API ORDER STATUS
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "Approved"
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Tour De Planet Earth Server');
});

app.listen(port, () => {
    console.log('Running Tour De Planet Earth Server on port', port);
})
