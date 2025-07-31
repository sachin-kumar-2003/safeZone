const mongoose = require('mongoose');
require('dotenv').config();

const db = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(db , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('database connected successfully');
    } catch (error) {
        console.error('database connection failed ',error.message);  
        process.exit(1);
    }
}
module.exports = connectDB;