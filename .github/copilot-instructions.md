<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Reddit Sentiment Analysis Dashboard

This is a full-stack MERN application for analyzing Reddit sentiment using AI.

## Project Structure
- `frontend/` - React.js with Vite, Chart.js, custom CSS with glassmorphism design
- `backend/` - Node.js/Express server with Reddit API and Hugging Face integration

## Key Technologies
- **Frontend**: React with Vite, Chart.js, Axios, custom CSS with Poppins font
- **Backend**: Express.js, Reddit JSON API, Hugging Face Inference API
- **AI/ML**: DistilBERT sentiment analysis model via Hugging Face

## Development Guidelines
- Use modern ES6+ JavaScript features
- Follow React hooks patterns (useState, useEffect)
- Implement proper error handling for API calls
- Use async/await for all API requests
- Maintain responsive design with mobile-first approach
- Follow the existing glassmorphism design system with gradients

## API Integration
- Reddit API: `https://www.reddit.com/search.json` for fetching posts
- Hugging Face API: `distilbert-base-uncased-finetuned-sst-2-english` for sentiment analysis
- Environment variables for API keys and configuration

## UI/UX Patterns
- Dark theme with gradient backgrounds
- Glassmorphism cards with backdrop blur
- Animated progress bars and loading states
- Color-coded sentiment tags (green=positive, red=negative, orange=neutral)
- Responsive grid layouts that adapt to mobile screens
