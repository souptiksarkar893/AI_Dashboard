# AI-Powered Reddit Sentiment Analysis Dashboard

A full-stack web application that analyzes Reddit sentiment using AI. Enter any keyword and discover what Reddit thinks about it through AI-powered sentiment analysis using Hugging Face's advanced language models.

![Dashboard Screenshot](https://via.placeholder.com/800x400/1e3c72/ffffff?text=AI+Reddit+Sentiment+Dashboard)

## 🚀 Features

- **Real-time Sentiment Analysis**: Analyze Reddit posts using Hugging Face's DistilBERT model
- **Beautiful Dark UI**: Custom gradient design with smooth animations and glassmorphism effects
- **Interactive Charts**: Visualize sentiment distribution with Chart.js
- **Progress Tracking**: Real-time progress indicators during analysis
- **AI-Generated Insights**: Get intelligent summaries and recommendations
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Recent Posts Display**: See analyzed posts with color-coded sentiment tags

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite for fast development
- **Chart.js** for beautiful data visualizations
- **Axios** for API communication
- **Custom CSS** with Poppins font and gradient themes

### Backend
- **Node.js** with Express.js
- **Reddit API** for fetching posts
- **Hugging Face API** for sentiment analysis
- **CORS** for cross-origin requests

### AI/ML
- **Hugging Face Inference API**
- **DistilBERT** sentiment analysis model
- **Confidence-based neutral detection**

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Hugging Face API Key** (free from [huggingface.co](https://huggingface.co/settings/tokens))

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd AI_Dash
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
HUGGING_FACE_API_KEY=your_hugging_face_api_key_here
PORT=5000
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Get Your Hugging Face API Key
1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Create a new token (read access is sufficient)
3. Copy the token and paste it in your backend `.env` file

## 🚀 Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:5000`

### Start the Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

## 🎯 How to Use

1. **Open the Application**: Navigate to `http://localhost:5173`
2. **Enter a Keyword**: Type any topic like "Tesla", "Bitcoin", "AI", etc.
3. **Click Analyze**: Watch the progress bar as the app:
   - Fetches recent Reddit posts
   - Analyzes each post with AI
   - Generates insights and visualizations
4. **View Results**: Explore the sentiment distribution, AI insights, and analyzed posts

## 📊 Example Keywords to Try

- **Technology**: `ChatGPT`, `AI`, `Tesla`, `Apple`, `Google`
- **Finance**: `Bitcoin`, `Stock Market`, `Economy`, `Inflation`
- **Entertainment**: `Gaming`, `Netflix`, `Marvel`, `Music`
- **Current Events**: `Climate Change`, `Politics`, `Space`

## 🔧 API Endpoints

### Backend API Routes

#### `POST /api/analyze`
Analyzes sentiment for a given keyword.

**Request Body:**
```json
{
  "keyword": "Tesla"
}
```

**Response:**
```json
{
  "keyword": "Tesla",
  "totalPosts": 15,
  "sentimentDistribution": {
    "positive": 10,
    "negative": 3,
    "neutral": 2,
    "positivePercentage": 67,
    "negativePercentage": 20,
    "neutralPercentage": 13
  },
  "insight": "Most Reddit users are positive about Tesla today, with 67% positive posts!",
  "posts": [...],
  "timestamp": "2025-01-29T..."
}
```

#### `GET /api/health`
Health check endpoint.

## 🎨 UI Design Features

- **Glassmorphism Effects**: Translucent cards with backdrop blur
- **Gradient Animations**: Animated text gradients and backgrounds
- **Progress Indicators**: Smooth progress bars with status updates
- **Color-Coded Sentiments**: 
  - 🟢 Positive (Green)
  - 🔴 Negative (Red)  
  - 🟡 Neutral (Orange)
- **Responsive Grid Layout**: Adapts to different screen sizes
- **Hover Animations**: Interactive elements with smooth transitions

## 🔍 How Sentiment Analysis Works

1. **Data Fetching**: Uses Reddit's JSON API to fetch recent posts
2. **Text Processing**: Extracts post titles and content
3. **AI Analysis**: Sends text to Hugging Face's DistilBERT model
4. **Sentiment Classification**: 
   - High confidence (>60%) → Positive/Negative
   - Low confidence (≤60%) → Neutral
5. **Insight Generation**: AI-powered summary based on sentiment distribution

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Vercel or Netlify
3. Update environment variables with production API URL

### Backend (Render/Railway)
1. Deploy to Render or Railway
2. Set environment variables (Hugging Face API key)
3. Update frontend `.env` with production backend URL

## 📁 Project Structure

```
AI_Dash/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchForm.jsx
│   │   │   ├── LoadingProgress.jsx
│   │   │   ├── SentimentChart.jsx
│   │   │   ├── ResultsDisplay.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── .env
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Check if port 5000 is available
- Verify Hugging Face API key is correct
- Run `npm install` in backend directory

**Frontend API errors:**
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify `.env` file has correct API URL

**No Reddit posts found:**
- Try different keywords
- Check internet connection
- Reddit API might be rate-limited

**Sentiment analysis failing:**
- Verify Hugging Face API key
- Check API quota/limits
- Ensure proper token permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hugging Face** for providing free AI inference APIs
- **Reddit** for the open JSON API
- **Chart.js** for beautiful data visualizations
- **React & Vite** for the development framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Open an issue on GitHub
3. Contact the development team

---

**Made with ❤️ and AI** - Happy analyzing! 🚀
