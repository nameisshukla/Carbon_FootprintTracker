# 🌍 Carbon Footprint Tracker

A modern, full-stack application designed to help users calculate, track, and reduce their daily carbon footprint. The application features an interactive dashboard with real-time analytics, habit logging, and an intelligent AI Eco-Chatbot powered by Google Gemini to suggest personalized green alternatives.

---

## ✨ Key Features

- 🔐 **User Authentication**: Secure registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- 📊 **Carbon Tracker Dashboard**: Log activities across categories (transportation, energy, waste, diet) and view your carbon emissions in real-time.
- 📈 **Data Visualization**: Dynamic charts (powered by Chart.js) showing your carbon trends and footprint distribution.
- 🤖 **AI Eco-Chatbot**: An intelligent conversational agent powered by **Google Gemini API** to analyze carbon habits and provide customized eco-friendly recommendations.
- ⚡ **Sleek, Modern UI**: Fully responsive interface featuring rich glassmorphism, tailored dark themes, and smooth micro-animations powered by Framer Motion.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (built with Vite)
- **Styling**: Vanilla CSS (Custom properties, responsive layouts, glassmorphism)
- **Charts**: Chart.js & React-Chartjs-2
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **AI Integration**: Google Generative AI SDK (Gemini API)
- **Security & Auth**: JSON Web Tokens (JWT) & bcryptjs

---

## 📂 Project Structure

```text
carbon-footprint-tracker/
├── backend/
│   ├── config/             # DB and config setup
│   ├── controllers/        # Request handling logic
│   ├── middleware/         # Auth verification middleware
│   ├── models/             # Mongoose schemas (User, Activity)
│   ├── routes/             # API endpoints (auth, activities, chat)
│   ├── server.js           # Server entry point
│   └── .env.example        # Environment variables template
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── api/            # Axios instance and config
│   │   ├── components/     # Reusable components (Navbar, Chatbot, Charts)
│   │   ├── context/        # Global state (Auth, Activity)
│   │   ├── pages/          # Page views (Landing, Dashboard, Log Activity)
│   │   ├── App.jsx         # App routing and layout definition
│   │   └── main.jsx        # App entry point
│   ├── vite.config.js      # Vite configuration
│   └── package.json
└── README.md               # Main documentation file
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v16 or higher)
- MongoDB account (local or MongoDB Atlas cluster)
- Google Gemini API Key (get one from Google AI Studio)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` (or the structure below) and fill in your keys:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

## ☁️ Deployment

For a detailed deployment workflow to **Render**, please refer to the [Deployment Guide](deployment_guide.md). 

### Key Env Variables for Production:
- **Backend (Web Service)**: `PORT`, `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`.
- **Frontend (Static Site)**: `VITE_API_URL` pointing to your deployed backend URL (e.g., `https://api.yourdomain.com/api`).
