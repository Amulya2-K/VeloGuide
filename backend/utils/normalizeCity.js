function normalizeCity(city) {
    if (!city || typeof city !== 'string') {
        return '';
    }

    return city
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');
}

module.exports = normalizeCity;