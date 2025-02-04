const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwtdtr7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

        const allStudentsCollection = client.db('unicresult-Database').collection('student-info');

        app.get("/allStudents", async (req, res) => {
            try {
                const students = await allStudentsCollection.find().toArray();
                console.log("Students fetched from DB:", students);
                res.json(students);
            } catch (error) {
                console.error("Error fetching students:", error);
                res.status(500).json({ message: "Server error" });
            }
        });

        app.get('/allStudents/:rollNumber', async (req, res) => {
            const rollNumber = parseInt(req.params.rollNumber);
            
            try {
                const student = await allStudentsCollection.findOne({ rollNumber: rollNumber });

                if (!student) {
                    return res.status(404).json({ message: 'Student not found' });
                }

                res.json(student);
            } catch (error) {
                console.error("Error fetching student by Roll Number:", error);
                res.status(500).json({ message: 'Server error' });
            }
        });

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Data is fetching !!!!');
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
