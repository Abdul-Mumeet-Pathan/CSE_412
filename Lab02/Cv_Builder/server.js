const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection URI
const uri = "mongodb+srv://test:test1234@cluster0.f6uai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;
let contactsCollection;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    // Ping database to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged deployment. Successfully connected to MongoDB!");

    // Set database and collection
    db = client.db("Port");
    contactsCollection = db.collection("contacts");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Root route
app.get('/', (req, res) => {
  console.log("Root endpoint accessed at:", new Date().toISOString());
  res.send('MongoDB API is running! Head to /get-contacts to see data.');
});

// ✅ API to handle form submission (script1.js)
app.post('/submit-contact', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Check if user already exists
    const existingUser = await contactsCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Insert new user
    const result = await contactsCollection.insertOne(req.body);
    res.status(201).json({ message: 'User data saved successfully!', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Error saving data', error: error.message });
  }
});

// ✅ Dynamic API to update user details (Works for script2.js, script3.js, etc.)
app.post('/update-user', async (req, res) => {
  try {
    const { email, updateData } = req.body;

    if (!email || !updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Email and update data are required." });
    }

    // Update only the provided fields
    const result = await contactsCollection.updateOne(
      { email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User details updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user details", error: error.message });
  }
});

// ✅ API to retrieve user data by email
app.post('/get-user-data', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Retrieve user data from the database using the email
    const user = await contactsCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Send the user's data with all fields from the JSON structure
    res.status(200).json({
      data: {
        name: user.name || '',
        surname: user.surname || '',
        profession: user.profession || '',
        city: user.city || '',
        postcode: user.postcode || '',
        division: user.division || '',
        phone: user.phone || '',
        email: user.email || '',
        additionalCoursework: user.additionalCoursework || '',
        degree: user.degree || '',
        fieldOfStudy: user.fieldOfStudy || '',
        graduationMonth: user.graduationMonth || '',
        graduationYear: user.graduationYear || '',
        institution: user.institution || '',
        institutionLocation: user.institutionLocation || '',
        experience: user.experience || {},
        skill: user.skill || {}
      }
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});
// Connect to MongoDB and start the server
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(console.error);

// Handle server shutdown properly
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});