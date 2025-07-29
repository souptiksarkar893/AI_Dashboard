import React from 'react';

const SearchForm = ({ keyword, setKeyword, onAnalyze, onSuggestionClick, loading }) => {
  const suggestions = ['Tesla', 'Apple', 'Bitcoin', 'ChatGPT', 'AI', 'Climate Change', 'Gaming'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(keyword);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Try searching for a trending topic like Tesla or Bitcoin..."
          className="search-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={loading || !keyword.trim()}
        >
          {loading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>
      </form>

      <div className="search-suggestions">
        <div className="suggestions-label">Popular topics:</div>
        <div className="suggestion-tags">
          {suggestions.map((suggestion) => (
            <span
              key={suggestion}
              className="suggestion-tag"
              onClick={() => !loading && onSuggestionClick(suggestion)}
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {suggestion}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
