const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Connect = require('./connect'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGO_URL;

app.use(express.json());

mongoose.connect(MONGOURL)
  .then(() => {
    console.log('Connection to database successful');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await Connect.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already exists" });
    }
    const newUser = new Connect({ firstName, lastName, email, password });
    await newUser.save();
    return res.status(201).send({ message: "Registration successful" });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
