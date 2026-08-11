const Guide = require('../models/Guide');
const normalizeCity = require('../utils/normalizeCity');

const {
    getGuidesByCity,
    loadGuideCache
} = require('../services/guideCache');

// ======================================================
// INITIAL GUIDE DATA
// ======================================================

const INITIAL_SEEDS = [
    {
        name: 'Aarav Sharma',
        email: 'aarav.mumbai@veloguide.com',
        password: '$2a$10$hashedpasswordplaceholder',
        assignedCity: 'Mumbai',
        languages: ['English', 'Hindi', 'Marathi'],
        bio: 'Born and raised in South Mumbai. Passionate about heritage architecture, Bollywood trivia, and street food walking tours in Colaba and Dadar.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        hourlyRate: 600,
        rating: 4.95,
        reviewCount: 38,
        specialties: ['Street Food', 'Heritage Architecture', 'Photography Walks'],
        experienceYears: 5,
        phone: '+91 98200 11223',
        status: 'Verified SuperGuide'
    },

    {
        name: 'Priya Nair',
        email: 'priya.kochi@veloguide.com',
        password: '$2a$10$hashedpasswordplaceholder',
        assignedCity: 'Fort Kochi',
        languages: ['English', 'Malayalam', 'Tamil'],
        bio: 'Local historian and eco-tour specialist. Explores Chinese fishing nets, Dutch Palace heritage, and authentic Malabar seafood joints.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        hourlyRate: 500,
        rating: 4.88,
        reviewCount: 45,
        specialties: ['Colonial History', 'Cultural Arts', 'Backwater Kayaking'],
        experienceYears: 4,
        phone: '+91 94470 33445',
        status: 'Verified Local Guide'
    },

    {
        name: 'Vikram Singh',
        email: 'vikram.udaipur@veloguide.com',
        password: '$2a$10$hashedpasswordplaceholder',
        assignedCity: 'Udaipur',
        languages: ['English', 'Hindi', 'Rajasthani'],
        bio: 'Royal palace historian and art curator. Specializing in Lake Pichola boat tours, Mewar history, and local handicrafts.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        hourlyRate: 700,
        rating: 4.98,
        reviewCount: 52,
        specialties: ['Royal Heritage', 'Palace Architecture', 'Traditional Crafts'],
        experienceYears: 7,
        phone: '+91 94140 55667',
        status: 'Verified SuperGuide'
    },

    {
        name: 'Ananya Roy',
        email: 'ananya.goa@veloguide.com',
        password: '$2a$10$hashedpasswordplaceholder',
        assignedCity: 'Goa',
        languages: ['English', 'Hindi', 'Konkani', 'Portuguese'],
        bio: 'Heritage Latin Quarter (Fontainhas) guide, spice plantation specialist, and hidden beach explorer.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        hourlyRate: 550,
        rating: 4.92,
        reviewCount: 29,
        specialties: ['Portuguese Architecture', 'Culinary Trails', 'Eco Trails'],
        experienceYears: 3,
        phone: '+91 98221 77889',
        status: 'Verified Local Guide'
    },

    {
        name: 'Kabir Verma',
        email: 'kabir.delhi@veloguide.com',
        password: '$2a$10$hashedpasswordplaceholder',
        assignedCity: 'Delhi',
        languages: ['English', 'Hindi', 'Urdu'],
        bio: 'Old Delhi food walk master & Mughal architecture enthusiast. Taking you through Chandni Chowk alleys and Humayun Tomb history.',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        hourlyRate: 650,
        rating: 4.90,
        reviewCount: 61,
        specialties: ['Mughal Architecture', 'Old Delhi Food Walks', 'Bazaar Shopping'],
        experienceYears: 6,
        phone: '+91 98100 99001',
        status: 'Verified SuperGuide'
    },

    {
        name: 'Devidas Menon',
        email: 'devidas.munnar@veloguide.com',
        password: '$2a$10$hashedpasswordplaceholder',
        assignedCity: 'Munnar',
        languages: ['English', 'Malayalam'],
        bio: 'Trekking guide and tea plantation specialist. Leading sunrise peak hikes and flora/fauna observation trails.',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
        hourlyRate: 450,
        rating: 4.85,
        reviewCount: 31,
        specialties: ['Trekking', 'Tea Plantation Walks', 'Wildlife Watching'],
        experienceYears: 4,
        phone: '+91 94461 22334',
        status: 'Verified Local Guide'
    }
];


// ======================================================
// SEED GUIDES
// ======================================================

const seedGuidesIfEmpty = async () => {
    try {

        const count = await Guide.countDocuments();

        if (count === 0) {

            console.log(
                '🌱 Seeding initial VeloGuide local guides...'
            );

            // Add normalized city key
            const seedsWithCityKey = INITIAL_SEEDS.map(
                guide => ({
                    ...guide,
                    assignedCityKey:
                        normalizeCity(
                            guide.assignedCity
                        )
                })
            );

            const insertedGuides =
                await Guide.insertMany(
                    seedsWithCityKey
                );

            // Add seeded guides to in-memory cache
            for (const guide of insertedGuides) {
                addGuideToCache(guide);
            }

            console.log(
                '✅ Seeded 6 initial local guides across key destinations.'
            );
        }

    } catch (err) {

        console.error(
            '❌ Seed error:',
            err
        );
    }
};


// ======================================================
// 1. SEARCH GUIDES BY CITY
// ======================================================

exports.searchGuidesByCity = async (req, res) => {
    try {
        const { city } = req.params;

        const normalizedCity = normalizeCity(city);

        if (!normalizedCity) {
            return res.status(400).json({
                success: false,
                message: 'City is required'
            });
        }

        // -----------------------------------------
        // STEP 1: Make sure seed data exists
        // -----------------------------------------

        await seedGuidesIfEmpty();

        // -----------------------------------------
        // STEP 2: Try fast Map lookup
        // -----------------------------------------

        let guides = getGuidesByCity(normalizedCity);

        // -----------------------------------------
        // STEP 3: If Map is empty, rebuild cache
        // -----------------------------------------

        if (!guides || guides.length === 0) {

            console.log(
                `🔄 Cache miss for "${normalizedCity}". Reloading guide cache...`
            );

            await loadGuideCache();

            guides = getGuidesByCity(normalizedCity);
        }

        // -----------------------------------------
        // STEP 4: Return safe guide data
        // -----------------------------------------

        const safeGuides = guides.map(guide => {

            const {
                password,
                ...safeGuide
            } = guide;

            return safeGuide;
        });

        return res.status(200).json({

            success: true,

            city: normalizedCity,

            count: safeGuides.length,

            searchTimeMs: 0,

            guides: safeGuides,

            message:
                safeGuides.length > 0
                    ? `${safeGuides.length} guide(s) found in ${normalizedCity}`
                    : `No guides are currently available in ${city}`
        });

    } catch (error) {

        console.error(
            '❌ Guide city search error:',
            error
        );

        return res.status(500).json({

            success: false,

            message: 'Failed to search guides',

            error: error.message
        });
    }
};


// ======================================================
// 2. FETCH SINGLE GUIDE
// ======================================================

exports.getGuideById = async (req, res) => {

    try {

        const guide =
            await Guide
                .findById(req.params.id)
                .select('-password');

        if (!guide) {

            return res.status(404).json({

                success: false,

                message:
                    'Guide not found'
            });
        }

        res.json({

            success: true,

            data: guide
        });

    } catch (error) {

        console.error(
            'Get guide error:',
            error
        );

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};


// ======================================================
// 3. FETCH ALL GUIDES
// ======================================================

exports.getAllGuides = async (req, res) => {

    try {

        await seedGuidesIfEmpty();

        const guides =
            await Guide
                .find()
                .select('-password');

        res.json({

            success: true,

            count: guides.length,

            data: guides
        });

    } catch (error) {

        console.error(
            'Get all guides error:',
            error
        );

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};


// ======================================================
// EXPORT SEED FUNCTION
// ======================================================

exports.seedGuidesIfEmpty =
    seedGuidesIfEmpty;