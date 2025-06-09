import express, { json } from 'express';
import cors from 'cors';
import connectDB from './db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/.env` });

const app = express();
const port = process.env.PORT || 5100;

// Connect to MongoDB
connectDB()
    .then(() => {
        console.log('Database connection established');
    })
    .catch((error) => {
        console.error('Could not connect to database:', error);
        process.exit(1);
    });

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.use(cors({
  origin: ['http://localhost:4173','http://localhost:5173','https://moviebustr.netlify.app'],
  credentials: true
}));

app.use(json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [Number],
    watchlist: [Number]
});

const User = mongoose.model('User', userSchema);

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            favorites: [],
            watchlist: []
        });

        await user.save();
        console.log('User registered successfully:', user);

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                favorites: user.favorites,
                watchlist: user.watchlist
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Add this route for debugging
app.get('/api/users/debug', async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude passwords
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.post('/api/users/favorites', async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    console.log('Received request:', { userId, movieId }); // Debug log

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const user = await User.findById(userId);
    console.log('Found user:', user); // Debug log

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        requestedId: userId
      });
    }

    const movieIdNumber = Number(movieId);
    const index = user.favorites.indexOf(movieIdNumber);

    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(movieIdNumber);
    }

    await user.save();
    
    res.json({ 
      message: 'Favorites updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        favorites: user.favorites,
        watchlist: user.watchlist
      }
    });
  } catch (error) {
    console.error('Server error:', error); // Debug log
    res.status(500).json({ 
      message: 'Error updating favorites',
      error: error.message 
    });
  }
});

app.post('/api/users/watchlist', async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    console.log('Received request:', { userId, movieId }); // Debug log

    // Try finding user by both id formats
    const user = await User.findOne({
      $or: [
        { _id: userId },
        { id: userId }
      ]
    });

    console.log('Found user:', user); // Debug log

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        requestedId: userId
      });
    }

    const movieIdNumber = Number(movieId);
    const index = user.watchlist.indexOf(movieIdNumber);

    if (index > -1) {
      user.watchlist.splice(index, 1);
    } else {
      user.watchlist.push(movieIdNumber);
    }

    await user.save();
    
    res.json({ 
      message: 'Watchlist updated successfully',
      user: {
        id: user._id, // Make sure to send back consistent id format
        username: user.username,
        email: user.email,
        favorites: user.favorites,
        watchlist: user.watchlist
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      message: 'Error updating watchlist',
      error: error.message 
    });
  }
});

app.get('/api/users/:userId/favorites', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ favorites: user.favorites });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Error fetching favorites' });
    }
});

app.get('/api/users/:userId/watchlist', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ watchlist: user.watchlist });
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ message: 'Error fetching watchlist' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});