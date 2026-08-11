const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Guide = require('../models/Guide');
const User = require('../models/User');
const normalizeCity = require('../utils/normalizeCity');

const JWT_SECRET =
    process.env.JWT_SECRET ||
    'veloguide_super_secret_jwt_key_2026';


// 1. Guide Registration
exports.registerGuide = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            assignedCity,
            languages,
            bio,
            hourlyRate,
            specialties,
            experienceYears,
            phone
        } = req.body;


        // Validate city
        if (!assignedCity || !assignedCity.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Service location city is required.'
            });
        }


        // Check existing guide
        const existingGuide =
            await Guide.findOne({ email });

        if (existingGuide) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered as a guide.'
            });
        }


        // Hash password
        const salt =
            await bcrypt.genSalt(10);

        const hashedPassword =
            await bcrypt.hash(password, salt);


        // Convert languages string to array
        const languagesArray =
            typeof languages === 'string'
                ? languages
                    .split(',')
                    .map(lang => lang.trim())
                    .filter(Boolean)
                : (languages || ['English']);


        // Convert specialties string to array
        const specialtiesArray =
            typeof specialties === 'string'
                ? specialties
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean)
                : (specialties || ['History', 'Culture']);


        // Normalize city
        const city = assignedCity.trim();

        const cityKey = normalizeCity(city);


        console.log(
            `📍 Registering guide: ${name}`
        );

        console.log(
            `🏙️ City: ${city}`
        );

        console.log(
            `🔑 City Key: ${cityKey}`
        );


        // Create guide
        const newGuide = new Guide({

            name,

            email,

            password: hashedPassword,

            assignedCity: city,

            // IMPORTANT
            assignedCityKey: cityKey,

            languages: languagesArray,

            bio:
                bio ||
                `Local expert guide in ${city}`,

            hourlyRate:
                Number(hourlyRate) || 500,

            specialties:
                specialtiesArray,

            experienceYears:
                Number(experienceYears) || 3,

            phone:
                phone ||
                '+91 98765 43210'
        });


        await newGuide.save();


        console.log(
            `✅ Guide registered successfully: ${name}`
        );


        res.status(201).json({

            success: true,

            message:
                'Guide profile registered successfully!',

            guide: {
                id: newGuide._id,
                name: newGuide.name,
                city: newGuide.assignedCity,
                cityKey: newGuide.assignedCityKey
            }
        });


    } catch (error) {

        console.error(
            '❌ Guide registration error:',
            error
        );

        res.status(500).json({

            success: false,

            message: error.message
        });
    }
};

// 2. Guide Login
exports.loginGuide = async (req, res) => {
  try {
    const { email, password } = req.body;

    const guide = await Guide.findOne({ email });
    if (!guide) return res.status(400).json({ success: false, message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, guide.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password." });

    const token = jwt.sign({ id: guide._id, role: 'guide', city: guide.assignedCity }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: guide._id,
        name: guide.name,
        email: guide.email,
        city: guide.assignedCity,
        role: 'guide'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Tourist Registration
exports.registerTourist = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: 'tourist'
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: 'tourist' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: 'tourist'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Tourist Login
exports.loginTourist = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password." });

    const token = jwt.sign({ id: user._id, role: 'tourist' }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'tourist'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
