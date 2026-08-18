# 🌍 VeloGuide – AI-Powered Local Guide Discovery & Booking Platform

VeloGuide is a full-stack travel platform that connects travelers with local guides based on their selected destination. It combines location-aware guide discovery, guide profile management, booking workflows, and AI-assisted itinerary generation to provide a personalized travel planning experience.

---

## ✨ Key Features

### 👤 Role-Based Authentication
- Separate authentication for Travelers and Local Guides
- JWT-based authentication
- Password hashing using BcryptJS
- Role-based authorization
- Protected routes for authenticated users

### 📍 Location-Aware Guide Discovery
- Search guides based on the selected destination
- Guides register with their service location
- City names are normalized using an `assignedCityKey`
- In-memory `Map` caching for fast city-based guide lookup
- Displays guides relevant to the selected destination

### 🧑‍💼 Guide Management
Guides can create profiles containing:
- Name and email
- Service location
- Languages spoken
- Areas of expertise
- Years of experience
- Hourly rate
- Biography
- Availability information

### 📅 Booking Management
Travelers can:
- Select a suitable local guide
- Create booking requests
- View booking status

Guides can manage booking requests through:

`Pending → Accepted → Completed`

### 🤖 AI Travel Assistant
Google Gemini API is integrated to provide:
- Personalized travel itineraries
- Destination-based recommendations
- Duration-aware planning
- Interest-based activity suggestions
- Travel-style-based planning

The AI assistant considers:
- Destination
- Number of days
- Interests
- Travel preferences

### 🔔 Real-Time Booking Updates
Socket.IO is used for real-time booking-related communication and status updates.

---

## 🛠️ Technology Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- React Router

### Backend

- Node.js
- Express.js
- REST APIs
- Socket.IO

### Database

- MongoDB
- Mongoose

### Authentication & Security

- JSON Web Tokens (JWT)
- BcryptJS
- Role-based authorization
- Environment variables

## ⚡ Performance Optimization

VeloGuide uses a normalized city key and an in-memory `Map` cache for fast guide lookup.

Instead of repeatedly querying MongoDB:

```text
Database
   ↓
Find guides
   ↓
Return results
```

the application can retrieve frequently accessed guide information through the cache:

```text
City
   ↓
Normalized City Key
   ↓
Map Cache
   ↓
Guides
```

This reduces unnecessary database queries and improves the speed of city-based guide discovery.

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Important

Never commit `.env` files containing actual credentials or API keys to GitHub.

Use:

```text
backend/.env.example
```

to document the required environment variables.

Example `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Amulya2-K/VeloGuide.git
cd VeloGuide
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create:

```text
backend/.env
```

Add your MongoDB connection string, JWT secret, Gemini API key, and other required configuration.

### 4. Start the Backend

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

---

## 🔒 Security

VeloGuide implements the following security mechanisms:

- Password hashing using BcryptJS
- JWT-based authentication
- Protected backend routes
- Role-based authorization
- Environment variables for sensitive credentials
- `.env` files excluded from version control

---

## 🎯 Project Objective

The main objective of VeloGuide is to provide travelers with a single platform to:

1. Discover local guides based on their destination.
2. View guide profiles and expertise.
3. Select and book suitable guides.
4. Track booking status.
5. Generate personalized travel itineraries using AI.
6. Receive booking updates.

---

## 🌟 What Makes VeloGuide Different?

VeloGuide combines several travel services into a single workflow:

```text
       Guide Discovery
              +
    Location-Based Matching
              +
     AI Itinerary Planning
              +
        Guide Booking
              +
      Booking Management
              +
       Real-Time Updates
```

The main technical features include:

- Location-aware guide discovery
- Normalized city-based guide matching
- In-memory caching for faster guide lookup
- AI-assisted itinerary generation
- Role-based authentication
- Structured booking workflows
- Real-time booking updates using Socket.IO

---

## 📌 Future Enhancements

- Online payment integration
- Guide ratings and reviews
- Advanced AI-based guide recommendations
- Map and location integration
- Guide availability calendars
- Push notifications
- Multi-language AI travel assistance
- Cloud deployment
- Admin dashboard
- Advanced analytics
