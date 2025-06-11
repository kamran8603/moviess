import mongoose from 'mongoose';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const dbpassi = "KxycwUbBHKoGBbIi" 
const mongourl = "mongodb+srv://haiderkamran2:KxycwUbBHKoGBbIi@cluster0.o0xrzn4.mongodb.net/"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables with explicit path
config({ path: join(__dirname, '.env') });

const connectDB = async () => {
    try {
        if (!mongourl) {
            throw new Error('MONGO_URI environment variable is not defined');
        }

        await mongoose.connect(mongourl, {
            serverSelectionTimeoutMS: 30000, // Increased timeout
            socketTimeoutMS: 60000,
            family: 4,
            directConnection: false
        });

        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        setTimeout(connectDB, 5000);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    setTimeout(connectDB, 5000);
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});

export default connectDB;