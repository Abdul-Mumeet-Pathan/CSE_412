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
let usersCollection; // ✅ New collection for user signups

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    // Ping database to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged deployment. Successfully connected to MongoDB!");

    // Set database and collections
    db = client.db("Port");
    contactsCollection = db.collection("contacts");
    usersCollection = db.collection("users"); // ✅ New users collection
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    if (error.name === 'MongoNetworkError') {
      console.error('Network error while connecting to MongoDB. Please check your connection or MongoDB URI.');
    }
    process.exit(1);  // Exit the process if connection fails
  }
}

// Root route
app.get('/', (req, res) => {
  console.log("Root endpoint accessed at:", new Date().toISOString());
  res.send('MongoDB API is running! Head to /get-contacts to see data.');
});

// ✅ API to handle user signup (From user.js)
app.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Insert new user
    const result = await usersCollection.insertOne({ fullName, email, password });
    res.status(201).json({ message: 'User registered successfully!', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// ✅ API to handle user login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find the user in the database
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    // Check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ API to handle form submissions
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

// ✅ API to handle user updates (education, experience, skills)
app.post('/update-user', async (req, res) => {
  try {
    const { email, updateData } = req.body;

    if (!email || !updateData) {
      return res.status(400).json({ message: "Email and update data are required." });
    }

    // Find the user in the database
    const user = await contactsCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please submit contact details first." });
    }

    // Update the user's data
    const result = await contactsCollection.updateOne(
      { email },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'User data updated successfully!' });
    } else {
      res.status(400).json({ message: 'No changes were made.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating user data', error: error.message });
  }
});

// Add this endpoint to your server.js file
app.post('/get-user-data', async (req, res) => {
  try {
    console.log('Request received at /get-user-data'); // Log when the endpoint is hit
    const { email } = req.body;
    console.log('Email received:', email); // Log the email

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Retrieve user data from the database using the email
    const user = await contactsCollection.findOne({ email });
    console.log('User found:', user); // Log the user data

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
        skills: user.skills || {}
      }
    });
  } catch (error) {
    console.error('Error in /get-user-data:', error); // Log the error
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

// ✅ Connect to MongoDB and start the server
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