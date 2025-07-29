import React from 'react';
import SentimentChart from './SentimentChart';

const ResultsDisplay = ({ results }) => {
  const { totalPosts, sentimentDistribution, insight, posts } = results;

  const getSentimentClass = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'sentiment-positive';
      case 'negative': return 'sentiment-negative';
      case 'neutral': return 'sentiment-neutral';
      default: return 'sentiment-neutral';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const posted = new Date(timestamp * 1000);
    const diffMs = now - posted;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Recently';
    }
  };

  return (
    <div className="results-container">
      {/* Statistics Card */}
      <div className="stats-card">
        <h3 className="card-title">Sentiment Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value total">{totalPosts}</div>
            <div className="stat-label">Total Posts</div>
          </div>
          <div className="stat-item">
            <div className="stat-value positive">{sentimentDistribution.positive}</div>
            <div className="stat-label">Positive ({sentimentDistribution.positivePercentage}%)</div>
          </div>
          <div className="stat-item">
            <div className="stat-value negative">{sentimentDistribution.negative}</div>
            <div className="stat-label">Negative ({sentimentDistribution.negativePercentage}%)</div>
          </div>
          <div className="stat-item">
            <div className="stat-value neutral">{sentimentDistribution.neutral}</div>
            <div className="stat-label">Neutral ({sentimentDistribution.neutralPercentage}%)</div>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="chart-card">
        <h3 className="card-title">Sentiment Distribution</h3>
        <SentimentChart 
          sentimentData={sentimentDistribution} 
          chartType="pie"
        />
      </div>

      {/* AI Insight Card */}
      <div className="insight-card">
        <h3 className="card-title">🤖 AI-Generated Insights</h3>
        <div className="insight-text">
          {insight}
        </div>
      </div>

      {/* Recent Posts Card */}
      <div className="posts-card">
        <h3 className="card-title">Recent Posts Analysis</h3>
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="post-item">
              <div className="post-header">
                <div className="post-title">{post.title}</div>
                <span className={`sentiment-tag ${getSentimentClass(post.sentiment)}`}>
                  {post.sentiment}
                </span>
              </div>
              {post.text && (
                <div className="post-content">
                  {post.text.length > 150 
                    ? `${post.text.substring(0, 150)}...` 
                    : post.text
                  }
                </div>
              )}
              <div className="post-meta">
                r/{post.subreddit} • by u/{post.author} • {formatTimeAgo(post.created)} • {post.score} upvotes
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
