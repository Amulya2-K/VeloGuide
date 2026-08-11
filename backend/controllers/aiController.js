const { GoogleGenAI } = require('@google/genai');
const Guide = require('../models/Guide');

// Initialize Gemini Client if API key is provided
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
let aiClient = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn("Gemini AI Client init warning:", err.message);
  }
}

// Fallback dynamic itinerary generator if AI API key is omitted
function generateFallbackItinerary(destination, durationDays, interests, travelStyle) {
  const days = [];
  const duration = parseInt(durationDays) || 3;
  const interestsList = (interests || 'Culture, Food, History').split(',').map(i => i.trim());

  const sampleActivities = {
    morning: [
      `Heritage morning walk around ${destination}'s historic quarter`,
      `Visit iconic local landmark and view scenic sunrise spots`,
      `Explore traditional artisan marketplace and early morning bazaar`,
      `Guided architecture tour of ancient temples & colonial sites`
    ],
    afternoon: [
      `Authentic local lunch at top-rated culinary spot tasting regional dishes`,
      `Guided museum visit & local craftsman workshop exploration`,
      `Scenic boat tour / nature walk near ${destination}'s prime highlight`,
      `Local food tasting trail curated by local culinary experts`
    ],
    evening: [
      `Sunset viewpoint gathering with panoramic photography spots`,
      `Evening street market exploration & souvenir shopping`,
      `Traditional cultural performance or relaxed cafe experience`,
      `Night market food tour & rooftop dining with city views`
    ]
  };

  for (let i = 1; i <= duration; i++) {
    const actM = sampleActivities.morning[(i - 1) % sampleActivities.morning.length];
    const actA = sampleActivities.afternoon[(i - 1) % sampleActivities.afternoon.length];
    const actE = sampleActivities.evening[(i - 1) % sampleActivities.evening.length];

    days.push({
      day: i,
      title: `Day ${i}: ${destination} ${interestsList[(i - 1) % interestsList.length] || 'Exploration'}`,
      morning: actM,
      afternoon: actA,
      evening: actE,
      insiderTip: `Ask your local VeloGuide about hidden photo spots and best local transport options for Day ${i}.`
    });
  }

  return {
    destination,
    durationDays: duration,
    travelStyle: travelStyle || 'Balanced Explorer',
    estimatedBudget: `₹${(duration * 2500).toLocaleString('en-IN')} - ₹${(duration * 4500).toLocaleString('en-IN')} (approx per person)`,
    summary: `Customized ${duration}-day ${travelStyle || 'travel'} itinerary in ${destination} focusing on ${interestsList.join(', ')}.`,
    itinerary: days
  };
}

exports.planTripWithAI = async (req, res) => {
  try {
    const { destination, durationDays, budget, travelStyle, interests } = req.body;

    if (!destination) {
      return res.status(400).json({ success: false, message: "Destination is required." });
    }

    const duration = parseInt(durationDays) || 3;
    const userInterests = interests || "Local culture, food, historic sites";
    const userStyle = travelStyle || "Cultural & Experiential";

    let aiItinerary = null;

    // Attempt Gemini AI Generation if client is available
    if (aiClient) {
      try {
        const prompt = `You are VeloGuide AI, an elite personal travel planner. Generate a detailed ${duration}-day trip itinerary for ${destination}.
Travel Style: ${userStyle}. Interests: ${userInterests}. Budget Level: ${budget || 'Moderate'}.

Return ONLY valid JSON matching this exact structure:
{
  "destination": "${destination}",
  "durationDays": ${duration},
  "travelStyle": "${userStyle}",
  "estimatedBudget": "₹XXXXX per person",
  "summary": "Short 2 sentence overview of the trip experience",
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1 title",
      "morning": "Morning activity description",
      "afternoon": "Afternoon activity description",
      "evening": "Evening activity description",
      "insiderTip": "Insider local secret"
    }
  ]
}`;

        const response = await aiClient.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: prompt
        });

        const textResponse = response.text;
        // Parse JSON from text response
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiItinerary = JSON.parse(jsonMatch[0]);
        }
      } catch (geminiErr) {
        console.warn("Gemini AI API call encountered an error, using dynamic fallback planner:", geminiErr.message);
      }
    }

    // Fallback if AI call didn't execute or failed
    if (!aiItinerary) {
      aiItinerary = generateFallbackItinerary(destination, duration, userInterests, userStyle);
    }

    // Automatically find & match registered VeloGuide local guides for this destination
    const regex = new RegExp(destination, 'i');
    let matchedGuides = await Guide.find({ assignedCity: { $regex: regex } }).select('-password');

    // If no guide found in exact city, return top-rated general guides
    if (matchedGuides.length === 0) {
      matchedGuides = await Guide.find().limit(3).select('-password');
    }

    res.json({
      success: true,
      plan: aiItinerary,
      recommendedGuides: matchedGuides
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
