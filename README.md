# 🥗 FoodMind – AI-Powered Diet Buddy

FoodMind is an AI-powered web application that helps users build personalized diet plans based on their preferences, health goals, and food restrictions. It uses Gemini AI API to generate smart diet advice tailored just for you.

[FoodMind](https://food-mind.vercel.app/)

---

## 🚀 Features

- 🧠 **AI-Powered Suggestions** – Get personalized meal recommendations.
- 📅 **Meal Planner** – Plan your meals for the entire week with smart AI-based scheduling.
- 🍎 **Nutritional Analysis** – Get macros and nutritional breakdown.
- 🗂 **User Dashboard** – Track your goals, meal history, and AI recommendations.
- 🌐 **Modern Stack** – Built with the MERN Stack (MongoDB, Express.js, React.js, Node.js).

---

## 🛠️ Tech Stack

| Frontend | Backend | AI & APIs | Database |
|---------|---------|-----------|----------|
| React.js (Vite) | Node.js + Express.js | Gemini API | MongoDB |

---

## 📦 To Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/prathmesh703/FoodMind-.git
cd FoodMind-
```

### 2. Set Up Environment Variables
Create .env files inside both foodmind-/ and server/ directories.

In foodMind-
```foodMind-
VITE_API_URL=http://localhost:5000
```
In server
```server
MONGO_URL = "YOUR_MONGO_URL"
JWT_SECRET = "JWT_SECRET"
AI_API_KEY="YOUR_AI_API"
```

### 3. Install and Start the server
```bash
cd server
npm install
node index.js
```
Open new terminal
### 4. Start the frontend
```bash
cd FoodMind-
npm install
npm run dev
```
