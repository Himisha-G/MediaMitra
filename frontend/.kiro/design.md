# MediaMitra - System Design Document

## Executive Summary

MediaMitra is an AI-powered content creation platform that consolidates niche discovery, content generation, performance analytics, and consistency tracking into a unified system. Built for the AI for Bharat Hackathon, it serves as an intelligent companion for content creators across India.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐
│  API Gateway    │
│  (AWS)          │
└────────┬────────┘
         │
         │ Invokes
         ▼
┌─────────────────────────────────────────┐
│         Lambda Functions                │
│  ┌──────────┐  ┌──────────┐            │
│  │ YouTube  │  │  Chat    │            │
│  │ Analytics│  │ Assistant│            │
│  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐            │
│  │  Event   │  │Challenge │            │
│  │ Manager  │  │ Tracker  │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
         │
         │ Integrates
         ▼
┌─────────────────────────────────────────┐
│         AWS Services                    │
│  • Bedrock (Claude AI)                  │
│  • DynamoDB (Data Store)                │
│  • S3 (Event Storage)                   │
│  • Cognito (Auth)                       │
│  • SES (Email)                          │
│  • EventBridge (Scheduling)             │
└─────────────────────────────────────────┘
```

### Technology Stack

**Frontend Layer**
- Next.js (React framework)
- Tailwind CSS (styling)
- Recharts (data visualization)

**API Layer**
- AWS API Gateway (REST endpoints)
- AWS Lambda (serverless compute)

**AI/ML Layer**
- AWS Bedrock (Claude 3 Haiku & Sonnet)
- Groq API (fast inference)
- HuggingFace Embeddings
- LangChain (orchestration)

**Data Layer**
- DynamoDB (NoSQL database)
- S3 (object storage)

**Authentication**
- AWS Cognito
- Google OAuth integration

**Infrastructure**
- AWS Region: ap-southeast-2 (Sydney)
- Serverless architecture

## Core Modules

### 1. Content Creator Module

**Purpose**: AI-driven niche discovery and content generation

**Features**:
- Multilingual voice and chat support
- Platform-specific script generation (YouTube, Shorts, Instagram Reels)
- Learning from user interaction history
- Personalized content recommendations

**Data Flow**:
```
User Input → Chat Interface → mediamitrachat.py → Bedrock Claude
                                    ↓
                              DynamoDB (chat history)
                                    ↓
                              Niche Analysis → Suggestions
```

**Key Components**:
- `mediamitrachat.py`: Conversational AI with multi-modal support
- DynamoDB table: `Mediamitra`
- Partition key: `USER#{user_id}`
- Sort key: `MSG#{timestamp}`

### 2. Video Analyzer Module

**Purpose**: Deep AI-driven video performance analysis

**Features**:
- Public video analysis (any YouTube URL)
- Private channel analytics (OAuth-connected)
- Engagement scoring
- Sentiment analysis
- Toxicity detection
- Improvement recommendations

**Data Flow**:
```
Video URL → youtube.py → YouTube API v3 → Video Metadata
                              ↓
                        Comment Analysis
                              ↓
                        Bedrock Claude → Performance Insights
```

**Analysis Components**:
- Engagement rate calculation
- Comment sentiment distribution
- Community health scoring
- Virality probability
- Actionable improvement suggestions

**Key Services**:
- `youtube.py`: Video analytics engine
- `ytaisuggest.py`: Growth recommendations
- Model: Claude 3 Haiku (fast analysis)

### 3. Event Manager Module

**Purpose**: Content scheduling with automated reminders

**Features**:
- Schedule content posts
- Email confirmations
- 24-hour reminder notifications
- Progress tracking
- Completion status updates

**Data Flow**:
```
Create Event → eventmanager.py → S3 Storage
                    ↓
              SES (confirmation email)
                    ↓
              EventBridge Scheduler → 24h reminder
```

**Storage Structure**:
- S3 Bucket: `bharat-event-manager`
- Path: `events/{user_id}/{event_id}.json`
- Event schema: id, title, platform, time, status, created

**Email Integration**:
- Source: mediamitra26@gmail.com
- AWS SES for delivery
- Timezone: Asia/Kolkata

### 4. Challenge Tracker Module

**Purpose**: 30-day consistency challenges

**Features**:
- Daily progress tracking
- Streak calculation
- Motivational system
- Challenge reset capability

**Data Flow**:
```
User Action → challengetrackerv.py → DynamoDB
                    ↓
              Progress Array (30 days)
                    ↓
              Streak Calculation → Response
```

**DynamoDB Schema**:
- Table: `challenge_tracker`
- Primary key: `user_id`
- Attributes: `progress` (array), `start_date`

**Actions**:
- start: Initialize new challenge
- get: Retrieve progress and streak
- update: Mark today complete
- reset: Delete challenge data

## Authentication & Security

### Authentication Flow

```
User Login → Cognito → Google OAuth → JWT Token
                            ↓
                    API Gateway Authorizer
                            ↓
                    Lambda (user_id extraction)
```

### Security Measures

- JWT-based authentication via Cognito
- User isolation (data scoped by user_id)
- CORS enabled for frontend integration
- Environment variables for sensitive keys
- IAM role-based permissions

### Required IAM Permissions

```
DynamoDB: GetItem, PutItem, UpdateItem, DeleteItem, Query
S3: GetObject, PutObject, ListObjectsV2
Bedrock: InvokeModel
SES: SendEmail
EventBridge: CreateSchedule
```

## Data Models

### Chat History (DynamoDB: Mediamitra)

```json
{
  "PK": "USER#abc123",
  "SK": "MSG#1234567890",
  "userMessage": "Help me find my niche",
  "aiMessage": "Based on your interests...",
  "timestamp": "2024-03-08T10:30:00Z"
}
```

### Event (S3: bharat-event-manager)

```json
{
  "id": "uuid-v4",
  "title": "Upload YouTube video",
  "platform": "YouTube",
  "time": "2024-03-15T14:00:00+05:30",
  "status": "scheduled",
  "created": "2024-03-08T10:30:00+05:30"
}
```

### Challenge Progress (DynamoDB: challenge_tracker)

```json
{
  "user_id": "abc123",
  "progress": [1, 1, 0, 1, 1, 0, 0, ...],
  "start_date": "2024-03-01",
  "streak": 3
}
```

### Video Analysis Response

```json
{
  "metadata": {
    "title": "Video Title",
    "channel": "Channel Name",
    "views": 10000,
    "likes": 500,
    "engagement_score": 5.2
  },
  "analysis": {
    "content_signals": {
      "strengths": ["High engagement", "Positive sentiment"],
      "weaknesses": ["Low CTR"],
      "risk_flags": []
    },
    "audience_analysis": {
      "sentiment_distribution": {"positive": 70, "neutral": 20, "negative": 10},
      "toxicity_score": 0.05,
      "community_health_score": 8.5
    },
    "improvement_plan": {
      "actionable_suggestions": ["Improve thumbnail", "Add chapters"],
      "virality_probability_score": 6.5
    }
  },
  "creator_advice": ["Focus on first 30 seconds", "Engage with comments"]
}
```

## API Endpoints

### YouTube Analytics
- `POST /youtube` - Analyze video by URL
- `POST /ytaisuggest` - Get improvement suggestions

### Chat Assistant
- `POST /chat` - Send message (text/image)
- `POST /chat` (action: get_niche) - Get niche suggestions

### Event Management
- `GET /events-manager` - Fetch user events
- `POST /events-manager` - Create scheduled event
- `PUT /events-manager` - Mark event complete

### Challenge Tracker
- `POST /challenge` (action: start) - Start challenge
- `POST /challenge` (action: get) - Get progress
- `POST /challenge` (action: update) - Mark day complete
- `POST /challenge` (action: reset) - Reset challenge

## AI Model Configuration

### Claude 3 Haiku (Fast Analysis)
- Model ID: `anthropic.claude-3-haiku-20240307-v1:0`
- Use cases: Chat, video analysis, quick insights
- Max tokens: 1200-1500
- Temperature: 0.7

### Claude 3 Sonnet (Deep Analysis)
- Model ID: `anthropic.claude-3-sonnet-20240229-v1:0`
- Use cases: Growth suggestions, strategic recommendations
- Max tokens: 300
- Temperature: 0.7

## Error Handling Strategy

### Standard Error Response

```python
{
  "statusCode": 500,
  "headers": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*"
  },
  "body": json.dumps({"error": "Error message"})
}
```

### Common Error Patterns

- Invalid JWT → 401 Unauthorized
- Missing parameters → 400 Bad Request
- Service failures → 500 Internal Server Error
- Rate limiting → 429 Too Many Requests

### Logging

- CloudWatch Logs for all Lambda functions
- Error tracking with stack traces
- Request/response logging for debugging

## Scalability Considerations

### Current Architecture Benefits

- Serverless auto-scaling (Lambda)
- DynamoDB on-demand capacity
- S3 unlimited storage
- Regional deployment (low latency)

### Future Scaling Strategies

- Multi-region deployment
- CloudFront CDN for frontend
- DynamoDB global tables
- Lambda reserved concurrency
- API Gateway caching

## Performance Optimization

### Lambda Optimization

- Minimal cold start (Python runtime)
- Connection pooling for AWS services
- Efficient JSON parsing
- Decimal conversion helpers

### Database Optimization

- Efficient key design (USER#, MSG# prefixes)
- Query patterns optimized for access
- Sparse indexes for filtering
- TTL for temporary data (future)

### AI Model Optimization

- Haiku for speed-critical paths
- Sonnet for quality-critical analysis
- Prompt engineering for token efficiency
- Response streaming (future)

## Monitoring & Observability

### Key Metrics

- Lambda invocation count
- Error rates by function
- API Gateway latency
- DynamoDB read/write capacity
- Bedrock token usage
- Email delivery rates

### Alerts

- Lambda error threshold exceeded
- DynamoDB throttling
- SES bounce rate high
- API Gateway 5xx errors

## Future Enhancements

### Phase 1 (Near-term)
- Multi-platform analytics (Instagram, Pinterest, Reddit, Spotify)
- AI-powered best time to post
- Advanced audience segmentation
- Creator growth forecasting

### Phase 2 (Mid-term)
- Real-time collaboration features
- Content A/B testing
- Automated content repurposing
- Trend prediction engine

### Phase 3 (Long-term)
- Cross-platform unified dashboard
- AI video editing suggestions
- Monetization optimization
- Creator marketplace

## Development Workflow

### Local Development

1. Set up AWS credentials
2. Configure environment variables
3. Use AWS SAM for local testing
4. Test Lambda functions individually

### Deployment

1. Package Lambda functions
2. Deploy via AWS Console/CLI
3. Update API Gateway routes
4. Test endpoints
5. Monitor CloudWatch logs

### Testing Strategy

- Unit tests for business logic
- Integration tests for AWS services
- End-to-end API tests
- Load testing for scalability

## Compliance & Privacy

### Data Privacy

- User data isolation by user_id
- No cross-user data leakage
- Secure JWT token handling
- Encrypted data at rest (S3, DynamoDB)

### GDPR Considerations

- User data export capability (future)
- Right to deletion (future)
- Consent management (future)
- Data retention policies (future)

## Cost Optimization

### Current Cost Drivers

- Lambda invocations
- Bedrock API calls
- DynamoDB storage
- S3 storage
- SES emails

### Optimization Strategies

- Efficient Lambda memory allocation
- DynamoDB on-demand vs provisioned
- S3 lifecycle policies
- Bedrock model selection (Haiku vs Sonnet)
- Email batching

## Conclusion

MediaMitra's architecture is designed for scalability, maintainability, and cost-effectiveness. The serverless approach enables rapid iteration while keeping operational overhead low. The modular design allows independent scaling of features based on usage patterns.

The platform's focus on AI-driven insights and creator support positions it as a comprehensive solution for content creators across India, with the flexibility to expand globally.

---

**Document Version**: 1.0  
**Last Updated**: March 8, 2024  
**Team**: MediaMitra  
**Hackathon**: AI for Bharat
