const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // Or use bcryptjs
const cors = require("cors"); // Add CORS middleware
const app = express();

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json());

// Mock database (replace with a real database)
const users = [];

// Signup endpoint
app.post("/signup", async (req, res) => {
    const { email, password, role } = req.body;

    // Check if user already exists
    const userExists = users.find((u) => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const user = { email, password: hashedPassword, role };
    users.push(user);

    // Log the users array after signup
    console.log("Users array after signup:", users);

    res.json({ message: "Signup successful", user });
});

// Login endpoint
app.post("/login", async (req, res) => {
    // Log the incoming request body
    console.log("Login request received:", req.body);

    const { email, password, role } = req.body;

    // Find the user in the mock database
    const user = users.find((u) => u.email === email && u.role === role);

    // Log the user found (or not found)
    console.log("User found:", user);

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Log whether the password is valid
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }

    // If everything is correct, send a success response
    res.json({ message: "Login successful", user });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
