const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdbname';

let isConnected = false;

async function connectToDatabase() {

    
    if (isConnected) {
        console.log('Using cached MongoDB connection');
        return mongoose.connection;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI);
        isConnected = db.connections[0].readyState;
        if (isConnected === 1) {
            console.log('New MongoDB connection established');
        } else {
            console.log('MongoDB connection status:', isConnected);
        }
        return mongoose.connection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = connectToDatabase;