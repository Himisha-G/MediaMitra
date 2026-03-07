---
inclusion: auto
---

# MediaMitra AI 🎬🤖

## Your AI Partner for Smarter Content Creation

MediaMitra is an AI-powered platform designed to support content creators at every stage of their journey — from discovering their niche, creating content, analyzing performance, and maintaining consistency.

Instead of using multiple disconnected tools, MediaMitra brings everything together into one intelligent system.

Built for the AI for Bharat Hackathon, MediaMitra focuses on making content creation accessible, data-driven, and sustainable for creators.

## Vision

MediaMitra is not just a tool. It is an AI companion for creators that helps them:
- Think better
- Create smarter
- Analyze deeper
- Stay consistent

The future of content creation should not depend on luck. It should depend on insight, strategy, and the right support system. And that is exactly what MediaMitra aims to provide.

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- Recharts

### Backend
- AWS Lambda
- API Gateway

### AI & Data
- AWS Bedrock
- Groq API
- HuggingFace Embeddings
- LangChain

### Authentication
- AWS Cognito
- Google OAuth

### Cloud Infrastructure
- AWS (Region: ap-southeast-2 Sydney)

---

# MediaMitra Backend - Project Context

This backend consists of AWS Lambda functions providing core services for YouTube analytics, content scheduling, challenge tracking, and AI-powered chat assistance.

## Platform Features

### 1. Content Creator Module
One of the biggest challenges for creators is finding their niche. MediaMitra uses AI-driven niche discovery that learns from:
- Previous user chats
- Content ideas
- Creator style and communication patterns

**Key Capabilities**:
- Multilingual Voice & Chat Support (accessible across Bharat)
- Platform-Specific Script Generation:
  - YouTube videos
  - Shorts
  - Instagram reels
  - Social media captions and posts
- Each script is optimized for audience behavior, format, and engagement patterns

### 2. Video Analyzer Module
Deep AI-driven analysis of video content:

**Public Video Analysis**: Analyze any YouTube video to understand:
- Engagement Score
- Performance Grade
- Comment Sentiment Analysis
- Audience Reaction Categories

**Private Channel Analysis**: Connect your YouTube channel via OAuth for:
- Personalized performance insights
- Content improvement suggestions
- Data-driven growth strategies

**Multi-Platform Analysis** (Future): Trend-based analysis for Instagram, Pinterest, Reddit, Spotify

### 3. Event Manager
Helps creators organize and track their content workflow:
- Content Scheduling
- Completion Rate Tracking
- Consistency Score Monitoring
- Progress Tracking
- Upcoming: AI-based Best Time to Post Recommendations

### 4. Challenge Tracker
30-day consistency challenges with:
- Consistency Wall
- Motivational reminders
- Progress encouragement
- Goal: Help creators keep going — even when growth feels slow

## Architecture Overview

All services are AWS Lambda functions using:
- AWS Bedrock (Claude AI models) for AI features
- DynamoDB for data persistence
- S3 for event storage
- SES for email notifications
- EventBridge Scheduler for reminders
- YouTube Data API v3 for video analytics

## Service Files

### 1. youtube.py - YouTube Video Analytics
**Purpose**: Deep analysis of YouTube videos using AI

**Key Features**:
- Video metadata extraction (views, likes, comments, thumbnails)
- Engagement rate calculation
- Comment sentiment analysis (positive/negative/neutral)
- Community health scoring
- Toxicity detection and spam filtering
- Content performance grading
- Virality probability scoring
- Creator improvement suggestions

**API Endpoint**: POST with `video_url` in body

**Dependencies**:
- YouTube Data API v3 (requires `YOUTUBE_API_KEY` env var)
- Bedrock model: `anthropic.claude-3-haiku-20240307-v1:0`

**Response Structure**:
```json
{
  "metadata": { "title", "channel", "views", "likes", "engagement_score" },
  "analysis": {
    "content_signals": { "strengths", "weaknesses", "risk_flags" },
    "audience_analysis": { "sentiment_distribution", "toxicity_score", "community_health_score" },
    "improvement_plan": { "actionable_suggestions", "virality_probability_score" }
  },
  "creator_advice": ["tip1", "tip2", "tip3"]
}
```

### 2. ytaisuggest.py - YouTube Growth Suggestions
**Purpose**: AI-powered video improvement recommendations

**Key Features**:
- Analyzes multiple videos at once
- Generates 5 actionable improvement ideas
- Uses video statistics (views, likes) for insights

**API Endpoint**: POST with `videos` array in body

**Dependencies**:
- Bedrock model: `anthropic.claude-3-sonnet-20240229-v1:0`

### 3. mediamitrachat.py - AI Chat Assistant
**Purpose**: Conversational AI for content creators with image support

**Key Features**:
- Multi-modal chat (text + images)
- Chat history persistence in DynamoDB
- Niche suggestion feature (action: "get_niche")
- Cognito authentication integration

**DynamoDB Schema**:
- Table: `Mediamitra`
- PK: `USER#{user_id}`
- SK: `MSG#{timestamp}`
- Attributes: `userMessage`, `aiMessage`

**API Endpoints**:
- POST `/chat` - Normal chat
- POST `/chat` with `action: "get_niche"` - Get 3 personalized niche suggestions

**Dependencies**:
- Bedrock model: `anthropic.claude-3-haiku-20240307-v1:0`

### 4. eventmanager.py - Content Scheduling System
**Purpose**: Schedule content posts with email reminders

**Key Features**:
- Create/read/update scheduled events
- Automatic confirmation emails on event creation
- 24-hour reminder emails before scheduled time
- EventBridge Scheduler integration
- S3-based event storage

**S3 Structure**:
- Bucket: `bharat-event-manager`
- Path: `events/{user_id}/{event_id}.json`

**API Endpoints**:
- GET `/events-manager` - Fetch all user events
- POST `/events-manager` - Create new event (sends confirmation + schedules reminder)
- PUT `/events-manager` - Mark event as completed

**Event Schema**:
```json
{
  "id": "uuid",
  "title": "string",
  "platform": "string",
  "time": "ISO datetime",
  "status": "scheduled|completed",
  "created": "ISO datetime"
}
```

**Email Source**: `mediamitra26@gmail.com`

### 5. mediamitraevents.py - Simple Event CRUD
**Purpose**: Basic event management (legacy/alternative implementation)

**Key Features**:
- Create and fetch events
- DynamoDB-based storage

**DynamoDB Schema**:
- Table: `events`
- PK: `userID`
- SK: `eventID`
- Attributes: `title`, `description`, `createdAt`

**API Endpoints**:
- GET `/events?userID={id}` - Fetch user events
- POST `/events` - Create event

### 6. challengetrackerv.py - 30-Day Challenge Tracker
**Purpose**: Track daily progress for 30-day content challenges

**Key Features**:
- Start new 30-day challenge
- Mark daily progress
- Calculate current streak
- Reset challenge
- Timezone: Asia/Kolkata

**DynamoDB Schema**:
- Table: `challenge_tracker`
- PK: `user_id`
- Attributes: `progress` (array of 30 days), `start_date`

**API Actions** (via POST body):
- `action: "start"` - Initialize new challenge
- `action: "get"` - Get progress and streak
- `action: "update"` - Mark today complete
- `action: "reset"` - Delete challenge

**Response Example**:
```json
{
  "progress": [1,1,0,0,...],
  "streak": 2
}
```

## Common Patterns

### Authentication
All services (except mediamitraevents.py) use AWS Cognito JWT:
```python
user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
email = event["requestContext"]["authorizer"]["jwt"]["claims"]["email"]
```

### CORS Headers
All responses include:
```python
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "*"
}
```

### Error Handling
Standard pattern:
```python
try:
    # logic
except Exception as e:
    print("ERROR:", str(e))
    return response(500, {"error": str(e)})
```

### AWS Region
All services use: `ap-southeast-2` (Sydney)

## Development Guidelines

1. **Testing Lambda Functions**: Use AWS SAM or Lambda console test events
2. **API Keys**: YouTube API key must be set as environment variable
3. **IAM Permissions Required**:
   - DynamoDB: GetItem, PutItem, UpdateItem, DeleteItem, Query
   - S3: GetObject, PutObject, ListObjectsV2
   - Bedrock: InvokeModel
   - SES: SendEmail
   - EventBridge Scheduler: CreateSchedule
4. **Decimal Handling**: DynamoDB returns Decimal types - use `convert_decimal()` helper
5. **Timezone**: Challenge tracker uses Asia/Kolkata timezone
6. **AI Model Limits**: Haiku max_tokens=1200-1500, Sonnet max_tokens=300

## File References

When working with these files, reference them as:
- #[[file:youtube.py]]
- #[[file:ytaisuggest.py]]
- #[[file:mediamitrachat.py]]
- #[[file:eventmanager.py]]
- #[[file:mediamitraevents.py]]
- #[[file:challengetrackerv.py]]

---

## Future Improvements

- Full multi-platform channel integrations
- AI best-time-to-post engine
- Advanced audience behavior prediction
- Creator growth forecasting
- Cross-platform analytics dashboard

---

Built for AI for Bharat Hackathon by Team MediaMitra
