const Guide = require('../models/Guide');
const normalizeCity = require('../utils/normalizeCity');

const guideCityMap = new Map();


// ==========================================
// LOAD GUIDES FROM MONGODB
// ==========================================

const loadGuideCache = async () => {

    try {

        const guides = await Guide
            .find()
            .select('-password')
            .lean();

        guideCityMap.clear();

        for (const guide of guides) {

            const cityKey =
                guide.assignedCityKey ||
                normalizeCity(guide.assignedCity);

            if (!cityKey) {
                continue;
            }

            if (!guideCityMap.has(cityKey)) {
                guideCityMap.set(cityKey, []);
            }

            guideCityMap
                .get(cityKey)
                .push(guide);
        }

        console.log(
            `📍 Guide cache loaded: ${guides.length} guides across ${guideCityMap.size} cities`
        );

        return guides;

    } catch (error) {

        console.error(
            '❌ Failed to load guide cache:',
            error
        );

        throw error;
    }
};


// ==========================================
// GET GUIDES BY CITY
// ==========================================

const getGuidesByCity = (city) => {

    const cityKey = normalizeCity(city);

    return guideCityMap.get(cityKey) || [];
};


// ==========================================
// ADD GUIDE
// ==========================================

const addGuideToCache = (guide) => {

    const cityKey =
        guide.assignedCityKey ||
        normalizeCity(guide.assignedCity);

    if (!cityKey) {
        return;
    }

    if (!guideCityMap.has(cityKey)) {
        guideCityMap.set(cityKey, []);
    }

    const guideObject =
        guide.toObject
            ? guide.toObject()
            : guide;

    guideCityMap
        .get(cityKey)
        .push(guideObject);
};


// ==========================================
// CACHE STATISTICS
// ==========================================

const getCacheStats = () => {

    let totalGuides = 0;

    for (const guides of guideCityMap.values()) {
        totalGuides += guides.length;
    }

    return {
        cities: guideCityMap.size,
        guides: totalGuides
    };
};


module.exports = {
    loadGuideCache,
    getGuidesByCity,
    addGuideToCache,
    getCacheStats
};