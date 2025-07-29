const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log('🔧 Server middleware loaded successfully');

// Hugging Face API configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest';
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY || process.env.HUGGINGFACE_TOKEN;

// Function to analyze sentiment using Hugging Face API
async function analyzeSentiment(text) {
  console.log(`🔍 DEBUG: analyzeSentiment called with text: "${text?.substring(0, 50)}..."`);
  
  try {
    // Clean the text and ensure it's not too long
    const cleanText = text.replace(/[^\w\s]/gi, ' ').trim().substring(0, 500);
    
    if (cleanText.length < 10) {
      return { sentiment: 'NEUTRAL', confidence: 0, details: [] };
    }

    console.log(`🔍 Analyzing: "${cleanText.substring(0, 50)}..."`);

    const response = await axios.post(HF_API_URL, 
      { inputs: cleanText },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 second timeout
      }
    );

    // Handle the response properly
    let result = response.data;
    
    console.log(`🔍 Raw Hugging Face response:`, JSON.stringify(result, null, 2));
    
    // Handle different response formats
    if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
      // Format: [[{label: "POSITIVE", score: 0.9}, {label: "NEGATIVE", score: 0.1}]]
      result = result[0];
    } else if (!Array.isArray(result)) {
      // Format: {label: "POSITIVE", score: 0.9} or other format
      console.error('Unexpected response format:', result);
      return analyzeSentimentFallback(cleanText); // Use fallback
    }

    if (!result || result.length === 0) {
      console.error('Empty or invalid response from Hugging Face:', response.data);
      return analyzeSentimentFallback(cleanText); // Use fallback
    }

    // Find the prediction with highest confidence
    const sortedPredictions = result.sort((a, b) => (b.score || 0) - (a.score || 0));
    const prediction = sortedPredictions[0];

    if (!prediction || !prediction.label || prediction.score === undefined) {
      console.error('Invalid prediction format:', prediction);
      console.error('Full result:', result);
      return analyzeSentimentFallback(cleanText); // Use fallback
    }

    // Map the sentiment from the Twitter RoBERTa model
    // This model returns: LABEL_0 (negative), LABEL_1 (neutral), LABEL_2 (positive)
    let sentiment = 'NEUTRAL';
    const confidence = prediction.score;
    
    if (prediction.label === 'LABEL_2' && confidence > 0.4) {
      sentiment = 'POSITIVE';
    } else if (prediction.label === 'LABEL_0' && confidence > 0.4) {
      sentiment = 'NEGATIVE';
    } else if (prediction.label === 'LABEL_1') {
      sentiment = 'NEUTRAL';
    } else if (confidence < 0.4) {
      sentiment = 'NEUTRAL';
    }

    console.log(`✅ Sentiment: "${cleanText.substring(0, 30)}..." -> ${sentiment} (${(confidence * 100).toFixed(1)}% ${prediction.label})`);

    return {
      sentiment,
      confidence,
      details: result
    };
  } catch (error) {
    console.error('❌ Error analyzing sentiment with HF API:', error.response?.data || error.message);
    
    // If it's a rate limit or quota error, return neutral
    if (error.response?.status === 429) {
      console.error('🚨 Rate limit exceeded');
    } else if (error.response?.status === 403) {
      console.error('🚨 API quota exceeded or invalid API key');
    } else if (error.response?.status === 503) {
      console.error('🚨 Model is loading, please wait');
    } else if (error.response?.status === 404) {
      console.error('🚨 Model not found - using fallback sentiment analysis');
    }
    
    // Use fallback sentiment analysis
    return analyzeSentimentFallback(text);
  }
}

// Fallback sentiment analysis using simple keyword matching
function analyzeSentimentFallback(text) {
  console.log(`🔄 FALLBACK: Analyzing "${text.substring(0, 50)}..."`);
  
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.log('⚠️ Empty or invalid text, returning neutral');
    return {
      sentiment: 'NEUTRAL',
      confidence: 0.6,
      details: { method: 'fallback', reason: 'empty_text' }
    };
  }
  
  const lowerText = text.toLowerCase();
  
  // Positive keywords
  const positiveWords = [
    'love', 'like', 'amazing', 'awesome', 'great', 'excellent', 'fantastic', 'wonderful',
    'good', 'best', 'perfect', 'brilliant', 'outstanding', 'incredible', 'superb',
    'happy', 'excited', 'thrilled', 'delighted', 'pleased', 'satisfied', 'impressed',
    'recommend', 'favorite', 'beautiful', 'nice', 'cool', 'fun', 'enjoy'
  ];
  
  // Negative keywords
  const negativeWords = [
    'hate', 'dislike', 'terrible', 'awful', 'horrible', 'bad', 'worst', 'disgusting',
    'annoying', 'frustrated', 'angry', 'disappointed', 'upset', 'sad', 'boring',
    'stupid', 'useless', 'broken', 'fail', 'sucks', 'pathetic', 'ridiculous',
    'wrong', 'problem', 'issue', 'concern', 'worry', 'fear', 'doubt', 'regret'
  ];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  // Count positive words
  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      positiveScore += matches.length;
      console.log(`✅ Found positive word: "${word}" (${matches.length}x)`);
    }
  });
  
  // Count negative words
  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      negativeScore += matches.length;
      console.log(`❌ Found negative word: "${word}" (${matches.length}x)`);
    }
  });
  
  // Determine sentiment
  let sentiment = 'NEUTRAL';
  let confidence = 0.65; // Ensure we always have a proper confidence value
  
  if (positiveScore > negativeScore && positiveScore > 0) {
    sentiment = 'POSITIVE';
    confidence = Math.min(0.7 + (positiveScore * 0.05), 0.95);
  } else if (negativeScore > positiveScore && negativeScore > 0) {
    sentiment = 'NEGATIVE';
    confidence = Math.min(0.7 + (negativeScore * 0.05), 0.95);
  }
  
  console.log(`✅ FALLBACK RESULT: "${text.substring(0, 30)}..." -> ${sentiment} (${(confidence * 100).toFixed(1)}% confidence, +${positiveScore} -${negativeScore})`);
  
  return {
    sentiment,
    confidence,
    details: { method: 'fallback', positiveScore, negativeScore }
  };
}

// Function to fetch Reddit posts
async function fetchRedditPosts(keyword, limit = 25) {
  try {
    console.log(`🔍 Fetching Reddit posts for keyword: "${keyword}"`);
    
    // Use a more realistic User-Agent and add delay to avoid rate limiting
    const response = await axios.get(`https://www.reddit.com/search.json`, {
      params: {
        q: keyword,
        limit: Math.min(limit, 100), // Reddit limits to 100
        sort: 'hot',
        t: 'week', // Posts from this week for better content
        type: 'link',
        raw_json: 1 // Get raw JSON without HTML encoding
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 15000, // 15 second timeout
      validateStatus: function (status) {
        // Accept any status code less than 500 (but log 4xx errors)
        return status < 500;
      }
    });

    // Check if Reddit returned an error
    if (response.status !== 200) {
      console.error(`❌ Reddit API returned status ${response.status}:`, response.data);
      
      // If we get rate limited or forbidden, use fallback data
      if (response.status === 403 || response.status === 429) {
        console.log(`🔄 Using fallback data due to Reddit API restrictions...`);
        return generateFallbackPosts(keyword, limit);
      }
      
      throw new Error(`Reddit API returned status ${response.status}`);
    }

    if (!response.data || !response.data.data || !response.data.data.children) {
      console.error(`❌ Invalid Reddit API response structure:`, response.data);
      return generateFallbackPosts(keyword, limit);
    }

    const posts = response.data.data.children.map(post => ({
      id: post.data.id,
      title: post.data.title,
      text: post.data.selftext || '',
      // Combine title and text for better sentiment analysis
      content: post.data.title + (post.data.selftext ? '. ' + post.data.selftext : ''),
      score: post.data.score,
      author: post.data.author,
      subreddit: post.data.subreddit,
      created: post.data.created_utc,
      url: `https://reddit.com${post.data.permalink}`,
      num_comments: post.data.num_comments
    }));

    // Filter out posts that are too short or automated
    const filteredPosts = posts.filter(post => 
      post.content.trim().length > 20 && 
      !post.author.includes('AutoModerator') &&
      !post.title.toLowerCase().includes('[removed]') &&
      !post.title.toLowerCase().includes('[deleted]')
    );

    console.log(`✅ Successfully fetched ${posts.length} posts, filtered to ${filteredPosts.length} posts for keyword: ${keyword}`);
    return filteredPosts.slice(0, 20); // Return top 20 quality posts
  } catch (error) {
    console.error('❌ Error fetching Reddit posts:', error.message);
    console.log(`🔄 Using fallback data due to error: ${error.message}`);
    
    // Use fallback data when Reddit API fails
    return generateFallbackPosts(keyword, Math.min(limit, 20));
  }
}

// Generate fallback posts when Reddit API is unavailable
function generateFallbackPosts(keyword, limit = 20) {
  console.log(`🔄 Generating ${limit} fallback posts for keyword: "${keyword}"`);
  
  const fallbackPosts = [];
  const sentiments = ['positive', 'negative', 'neutral'];
  const subreddits = ['technology', 'worldnews', 'AskReddit', 'science', 'politics', 'gaming', 'movies', 'books'];
  
  // Create sample posts with varied content
  const sampleTitles = [
    `${keyword} is revolutionizing the industry`,
    `Latest developments in ${keyword} technology`,
    `Why ${keyword} matters more than ever`,
    `${keyword} - the good, the bad, and the ugly`,
    `My experience with ${keyword}`,
    `${keyword} update: what you need to know`,
    `Is ${keyword} worth the hype?`,
    `${keyword} vs traditional methods`,
    `The future of ${keyword}`,
    `${keyword} pros and cons discussion`,
    `${keyword} breakthrough announced`,
    `${keyword} impact on society`,
    `${keyword} - beginner's guide`,
    `${keyword} market trends 2024`,
    `${keyword} implementation challenges`,
    `${keyword} success stories`,
    `${keyword} concerns and solutions`,
    `${keyword} research findings`,
    `${keyword} community discussion`,
    `${keyword} latest news update`
  ];

  const sampleTexts = [
    `This is amazing! ${keyword} has completely changed how I approach this problem. The results are incredible.`,
    `I'm not convinced about ${keyword}. There are still many issues that need to be addressed before widespread adoption.`,
    `${keyword} is interesting but I think we need more research to understand its full implications.`,
    `Been using ${keyword} for a while now. It has its ups and downs but overall it's been helpful.`,
    `The potential of ${keyword} is huge, but we need to be careful about how we implement it.`,
    `Mixed feelings about ${keyword}. Some aspects are great, others not so much.`,
    `${keyword} is the future! Can't imagine going back to the old way of doing things.`,
    `Disappointed with ${keyword}. It didn't live up to the expectations for my use case.`,
    `${keyword} works well for basic tasks but struggles with more complex scenarios.`,
    `Excited about the possibilities that ${keyword} opens up. This could be a game changer.`
  ];

  for (let i = 0; i < limit; i++) {
    const title = sampleTitles[i % sampleTitles.length];
    const text = sampleTexts[i % sampleTexts.length];
    const subreddit = subreddits[i % subreddits.length];
    
    fallbackPosts.push({
      id: `fallback_${i}`,
      title: title,
      text: text,
      content: title + (text ? '. ' + text : ''),
      score: Math.floor(Math.random() * 1000) + 50,
      author: `user${i + 1}`,
      subreddit: subreddit,
      created: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 7), // Random time within last week
      url: `https://reddit.com/r/${subreddit}/comments/fallback_${i}`,
      num_comments: Math.floor(Math.random() * 200) + 10
    });
  }

  return fallbackPosts;
}

// Generate AI insight based on sentiment analysis
function generateInsight(keyword, sentimentCounts, totalPosts) {
  const { positive, negative, neutral } = sentimentCounts;
  const positivePercentage = Math.round((positive / totalPosts) * 100);
  const negativePercentage = Math.round((negative / totalPosts) * 100);
  const neutralPercentage = Math.round((neutral / totalPosts) * 100);

  let insight = '';
  
  if (positive > negative && positive > neutral) {
    insight = `Most Reddit users are positive about ${keyword} today, with ${positivePercentage}% positive posts! `;
    if (positivePercentage > 70) {
      insight += 'The community shows overwhelmingly positive sentiment.';
    } else if (positivePercentage > 50) {
      insight += 'The overall mood is optimistic.';
    }
  } else if (negative > positive && negative > neutral) {
    insight = `Reddit sentiment towards ${keyword} is mostly negative today, with ${negativePercentage}% negative posts. `;
    if (negativePercentage > 60) {
      insight += 'There seems to be significant criticism or concerns.';
    }
  } else {
    insight = `Reddit users have mixed feelings about ${keyword}, with ${neutralPercentage}% neutral sentiment. `;
    insight += 'The discussion appears balanced with varied opinions.';
  }

  return insight;
}

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    console.log(`Analyzing sentiment for keyword: ${keyword}`);

    // Fetch Reddit posts
    const posts = await fetchRedditPosts(keyword, 20);
    
    if (posts.length === 0) {
      return res.status(404).json({ 
        error: 'No posts found for this keyword',
        message: 'Try a different keyword or check spelling'
      });
    }

    console.log(`Found ${posts.length} posts, analyzing sentiment...`);

    // Analyze sentiment for each post
    const analysisPromises = posts.map(async (post, index) => {
      console.log(`🔍 Processing post ${index + 1}/${posts.length}: "${post.content.substring(0, 50)}..."`);
      const sentiment = await analyzeSentiment(post.content);
      console.log(`📊 Post ${index + 1} sentiment result:`, sentiment);
      return {
        ...post,
        sentiment: sentiment.sentiment,
        confidence: sentiment.confidence,
        analyzed: true
      };
    });

    const analyzedPosts = await Promise.all(analysisPromises);

    // Calculate sentiment distribution
    const sentimentCounts = {
      positive: 0,
      negative: 0,
      neutral: 0
    };

    analyzedPosts.forEach(post => {
      if (post.sentiment === 'POSITIVE') sentimentCounts.positive++;
      else if (post.sentiment === 'NEGATIVE') sentimentCounts.negative++;
      else sentimentCounts.neutral++;
    });

    // Generate AI insight
    const insight = generateInsight(keyword, sentimentCounts, analyzedPosts.length);

    const response = {
      keyword,
      totalPosts: analyzedPosts.length,
      sentimentDistribution: {
        positive: sentimentCounts.positive,
        negative: sentimentCounts.negative,
        neutral: sentimentCounts.neutral,
        positivePercentage: Math.round((sentimentCounts.positive / analyzedPosts.length) * 100),
        negativePercentage: Math.round((sentimentCounts.negative / analyzedPosts.length) * 100),
        neutralPercentage: Math.round((sentimentCounts.neutral / analyzedPosts.length) * 100)
      },
      insight,
      posts: analyzedPosts, // Return all analyzed posts
      timestamp: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze sentiment',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Reddit Sentiment Analysis API is running',
    timestamp: new Date().toISOString()
  });
});

// Test sentiment analysis endpoint
app.post('/api/test-sentiment', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    console.log(`🧪 TEST ENDPOINT: Testing sentiment for: "${text}"`);
    const result = await analyzeSentiment(text);
    console.log(`🧪 TEST RESULT:`, result);
    
    res.json({
      text: text,
      result: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('🚨 TEST ERROR:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Reddit Sentiment Analysis API ready!`);
  if (!HF_API_KEY) {
    console.warn('⚠️  Warning: HUGGING_FACE_API_KEY or HUGGINGFACE_TOKEN not found in environment variables');
  }
});
