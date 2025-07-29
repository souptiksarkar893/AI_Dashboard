import { useState } from 'react';
import axios from 'axios';
import SentimentChart from './components/SentimentChart';
import LoadingProgress from './components/LoadingProgress';
import SearchForm from './components/SearchForm';
import ResultsDisplay from './components/ResultsDisplay';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState(null);

  // Simulate progress updates during analysis
  const simulateProgress = () => {
    setProgress(0);
    setLoadingStatus('Fetching Reddit posts...');
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          setLoadingStatus('Analyzing sentiment...');
          return prev;
        }
        
        if (prev >= 30 && prev < 60) {
          setLoadingStatus('Processing posts with AI...');
        } else if (prev >= 60) {
          setLoadingStatus('Generating insights...');
        }
        
        return prev + Math.random() * 15;
      });
    }, 500);

    return progressInterval;
  };

  const handleAnalyze = async (searchKeyword) => {
    if (!searchKeyword.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);
    
    const progressInterval = simulateProgress();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze`, {
        keyword: searchKeyword.trim()
      });

      clearInterval(progressInterval);
      setProgress(100);
      setLoadingStatus('Analysis complete!');
      
      setTimeout(() => {
        setResults(response.data);
        setLoading(false);
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      setLoading(false);
      
      if (error.response) {
        setError({
          title: 'Analysis Failed',
          message: error.response.data.message || error.response.data.error || 'Unable to analyze sentiment'
        });
      } else if (error.request) {
        setError({
          title: 'Connection Error',
          message: 'Unable to connect to the analysis server. Please check if the backend is running.'
        });
      } else {
        setError({
          title: 'Unexpected Error',
          message: error.message || 'Something went wrong during analysis'
        });
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Reddit Sentiment Analyzer</h1>
        <p>Discover what Reddit thinks about any topic using AI-powered sentiment analysis</p>
      </header>

      <SearchForm
        keyword={keyword}
        setKeyword={setKeyword}
        onAnalyze={handleAnalyze}
        onSuggestionClick={handleSuggestionClick}
        loading={loading}
      />

      {loading && (
        <LoadingProgress
          progress={progress}
          status={loadingStatus}
        />
      )}

      {error && (
        <ErrorMessage
          title={error.title}
          message={error.message}
        />
      )}

      {results && !loading && (
        <ResultsDisplay results={results} />
      )}
    </div>
  );
}

export default App;
