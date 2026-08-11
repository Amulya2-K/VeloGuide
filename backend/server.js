const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const guideRoutes = require('./routes/guideRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const aiRoutes = require('./routes/aiRoutes');

const {
    seedGuidesIfEmpty
} = require('./controllers/guideController');

const {
    loadGuideCache
} = require('./services/guideCache');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());
app.use(express.json());


// ======================================================
// DATABASE + GUIDE INITIALIZATION
// ======================================================

mongoose.connect(MONGO_URI)
    .then(async () => {

        console.log(
            '💾 MongoDB Connected Successfully to VeloGuide DB!'
        );

        try {

            // 1. Seed guides ONLY if collection is empty
            await seedGuidesIfEmpty();

            // 2. Load guides from MongoDB into HashMap
            await loadGuideCache();

            console.log(
                '✅ VeloGuide guide system initialized successfully'
            );

        } catch (error) {

            console.error(
                '❌ Guide initialization failed:',
                error
            );

        }

    })
    .catch(error => {

        console.error(
            '❌ MongoDB connection error:',
            error
        );

    });


// ======================================================
// API ROUTES
// ======================================================

// Authentication
app.use('/api/auth', authRoutes);

// Guide authentication / registration
// Keep this ONLY if authRoutes contains guide login/register endpoints
app.use('/api/guides', authRoutes);

// Guide search/profile routes
app.use('/api/guides', guideRoutes);

// Booking routes
app.use('/api/bookings', bookingRoutes);

// AI routes
app.use('/api/ai', aiRoutes);


// ======================================================
// LEGACY SOS ENDPOINT
// ======================================================

app.post('/api/security/sos-log', (req, res) => {

    const bookingController =
        require('./controllers/bookingController');

    return bookingController.createBooking(
        req,
        res
    );
});


// ======================================================
// GUIDE DASHBOARD BOOKINGS
// ======================================================

app.get(
    '/api/guides/dashboard/bookings',
    (req, res) => {

        const {
            authenticateToken
        } = require('./middleware/auth');

        const bookingController =
            require('./controllers/bookingController');

        return authenticateToken(
            req,
            res,
            () =>
                bookingController.getGuideBookings(
                    req,
                    res
                )
        );
    }
);


// ======================================================
// HEALTH CHECK
// ======================================================

app.get('/api/health', (req, res) => {

    res.json({
        status: 'ok',
        platform: 'VeloGuide AI Platform'
    });

});


// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {

    console.log(
        `🚀 VeloGuide Express Backend server running on http://localhost:${PORT}`
    );

});