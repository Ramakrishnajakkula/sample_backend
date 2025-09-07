const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});
const User = mongoose.model('User', userSchema);


app.post('/api/users', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newUser = new User({ name, email, message });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save user', details: err.message });
    }
});

app.get('/api/allusers', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users', details: err.message });
    }
});


app.get('/', (req, res) => {
    res.send('🚀 Server is running');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
