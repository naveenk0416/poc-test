const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const firRoutes = require('./routes/firRoutes');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/firs', firRoutes);

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error(
            'MongoDB connection error: MONGO_URI is not defined. Create a backend/.env file with MONGO_URI=<your-mongodb-uri>'
        );
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected');

        // Seed static admin user if doesn't exist
        const adminExists = await User.findOne({ email: 'admin@admin.com' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Naveen1234', salt);

            await User.create({
                name: 'System Admin',
                email: 'admin@admin.com',
                password: hashedPassword,
                gender: 'Male',
                userGroup: 'Admin'
            });
            console.log('Static Admin User seeded (admin@admin.com).');
        }

    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
