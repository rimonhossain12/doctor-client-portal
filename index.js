
const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors());
// access use posting data to the client to main server
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ygqbm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// connect the server
// using mongodb server;

async function run() {
    try {
        await client.connect();
        // console.log("database is connecting");
        const database = client.db('doctors_portal');
        const appointmentsCollections = database.collection('appointments');
        const usersCollection = database.collection('users');

        // find data using specific email;
        app.get('/appointments', async (req, res) => {
            const email = req.query.email;
            const date = new Date(req.query.date).toLocaleDateString();
            // console.log(date);
            const query = { email: email, date: date }
            // console.log(query);
            const cursor = appointmentsCollections.find(query);
            const appointments = await cursor.toArray();
            res.json(appointments);
        })

        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentsCollections.insertOne(appointment);
            res.json(result);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
            console.log(result);
        });
        app.put('/users', async (req, res) => {
            const user = req.body;
            console.log('put',user);
            const filter = { email: user.email }
            const options = { upsert: true };
            const updateDoc = { $set: user }
            const result = await usersCollection.updateOne(filter,updateDoc,options);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

// using node mongodb connection


app.get('/', (req, res) => {
    res.send('Hello doctors portal!')
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

/* import think of using backend database
    // sob data poar jnne
    app.get('/users');
    // ekjon ba nirdisto ekjon k paor jnne
    app.get('/users/:id');

    // update korere jnen
    app.put('/users/:id");
    // delete korer jnne
    app.delete('/users/:id');
*/