# VeloGuide: Full-Stack PCR-Verified Guide Registry & Assignment Dashboard

CertiTour is a cryptographically secured full-stack platform designed to bridge the gap between independent travelers and verified local guides. Built using the MERN stack (MongoDB, Express, React, Node.js), the platform implements an automated gatekeeper verification system that validates guide credentials against a pre-approved authority registry before account registration, ensuring traveler safety and community trust.

## 🚀 Key Features

- **Government-Grade Cross-Verification:** Validates registration requests by cross-referencing Police Clearance Registry (PCR) numbers against a simulated pre-approved authority database collection.
- **Cryptographic Security:** Built-in security layers featuring password hashing using `bcryptjs` and session authorization utilizing JSON Web Tokens (`JWT`).
- **Interactive Dispatch Dashboard:** A clean "Guide Assignment Desk" terminal interface for guides to track, accept, and safely sign off on real-time transit logs and bookings.
- **Dynamic Status Workflows:** Seamless frontend state updates changing live card structures between `Pending`, `Accepted`, and `Completed` without requiring page reloads.

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, Axios, CSS3 (Flexbox/Grid layout layouts)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose ODM
- **Authentication/Security:** JSON Web Tokens (JWT), BcryptJS, CORS Middleware

---

## 📂 Project Structure

```text
├── backend/
│   ├── models/
│   │   ├── Booking.js          # Schema for transit tracking logs
│   │   ├── Guide.js            # Schema for guide profile information
│   │   └── VerifiedPCR.js      # The pre-approved official registration whitelist
│   ├── server.js               # Central Express app config, database connections, and API routes
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── GuideRegistration.jsx   # Form onboarding with verification middleware
    │   │   ├── GuideDashboard.jsx      # Interactive dispatch dashboard setup
    │   │   └── DestinationDetail.jsx   # Tourist exploration selection module
    │   ├── App.jsx             # React routing core configuration
    │   └── main.jsx
    └── package.json
