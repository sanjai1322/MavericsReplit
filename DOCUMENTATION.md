# GenAI Coding Platform - Complete Documentation

## Overview

The GenAI Coding Platform is a comprehensive, futuristic educational environment for developers that combines AI-powered assistance, interactive learning, and competitive programming. The platform provides a complete coding experience with courses, an IDE, leaderboards, and real-time AI assistance.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom futuristic theming
- **Component Library**: Radix UI components with shadcn/ui system
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions
- **Code Editor**: Monaco Editor for IDE functionality

### Backend Architecture
- **Framework**: Node.js with Express and TypeScript
- **Database**: PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit's OpenID Connect system
- **Session Management**: PostgreSQL-backed sessions
- **AI Integration**: Google Gemini AI for code assistance

## Data Storage & Database Schema

### Database Tables

#### 1. Sessions Table (`sessions`)
```sql
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);
```
**Purpose**: Stores user session data for authentication
**Location**: PostgreSQL database
**Data Flow**: Created when user logs in, used for session validation

#### 2. Users Table (`users`)
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  xp INTEGER DEFAULT 0,
  rank INTEGER,
  badges TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```
**Purpose**: Stores user profile information and gamification data
**Data Sources**: 
- Profile data from Replit OpenID Connect
- XP and rankings from platform activities
- Badges earned through achievements

#### 3. Courses Table (`courses`)
```sql
CREATE TABLE courses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level VARCHAR NOT NULL,
  duration VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  thumbnail_url TEXT,
  enrolled INTEGER DEFAULT 0,
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```
**Purpose**: Stores course catalog information
**Categories**: frontend, backend, fullstack, ai, blockchain
**Levels**: beginner, intermediate, advanced
**AI Integration**: Courses can be AI-generated with descriptions and thumbnails

#### 4. User Courses Table (`user_courses`)
```sql
CREATE TABLE user_courses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) NOT NULL,
  course_id VARCHAR REFERENCES courses(id) NOT NULL,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```
**Purpose**: Tracks user enrollment and progress in courses
**Progress Tracking**: Percentage completion (0-100)
**Completion**: Boolean flag with timestamp

#### 5. AI Chats Table (`ai_chats`)
```sql
CREATE TABLE ai_chats (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) NOT NULL,
  session_id VARCHAR NOT NULL,
  messages JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```
**Purpose**: Persists AI chat conversations
**Message Format**: JSON array of {role, content} objects
**Session Management**: Groups related messages by session_id

#### 6. Code Snippets Table (`code_snippets`)
```sql
CREATE TABLE code_snippets (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  language VARCHAR NOT NULL,
  ai_assisted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```
**Purpose**: Stores user-created code snippets from the IDE
**Languages**: Supports multiple programming languages
**AI Assistance**: Tracks if AI helped generate/modify the code

## Application Flow & Data Movement

### 1. Authentication Flow
```
User Login → Replit OAuth → Session Creation → User Profile Upsert → Dashboard Access
```
**Data Storage**: 
- Session data in `sessions` table
- User profile in `users` table
- Authentication tokens in session store

### 2. Course Management Flow
```
Browse Courses → Enroll → Track Progress → Complete → Update Stats
```
**Data Storage**:
- Course catalog in `courses` table
- Enrollment tracking in `user_courses` table
- Progress updates via API endpoints

### 3. AI Assistance Flow
```
User Request → Gemini AI API → Response Processing → Chat History Storage
```
**Data Storage**:
- Chat sessions in `ai_chats` table
- API responses cached temporarily
- Code assistance integrated with IDE

### 4. IDE & Code Management
```
Code Writing → AI Assistance → Save Snippet → Share/Export
```
**Data Storage**:
- Code snippets in `code_snippets` table
- Monaco Editor state in browser memory
- AI suggestions via real-time API calls

## API Endpoints & Data Operations

### Authentication Endpoints
- `GET /api/auth/user` - Retrieve current user data
- `GET /api/login` - Initiate OAuth login
- `GET /api/callback` - OAuth callback handler
- `GET /api/logout` - End user session

### Course Management
- `GET /api/courses` - List courses (with optional category filter)
- `GET /api/courses/:id` - Get specific course details
- `POST /api/courses` - Create new course (admin/AI-generated)
- `GET /api/user/courses` - Get user's enrolled courses
- `POST /api/user/courses` - Enroll in a course

### AI Services
- `POST /api/ai/chat` - AI chat conversation
- `POST /api/ai/code-assistance` - Code help and debugging
- `POST /api/ai/generate-course` - AI course content generation

### IDE & Code Management
- `GET /api/snippets` - List user's code snippets
- `POST /api/snippets` - Save new code snippet
- `PUT /api/snippets/:id` - Update existing snippet
- `DELETE /api/snippets/:id` - Delete code snippet

### Leaderboard & Gamification
- `GET /api/leaderboard` - Get ranked user list
- `GET /api/user/stats` - Get user's XP and badges
- `POST /api/user/xp` - Award XP for activities

## Environment Configuration

### Required Environment Variables
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
REPL_ID=your-repl-id
REPLIT_DOMAINS=your-domain.replit.dev
ISSUER_URL=https://replit.com/oidc
SESSION_SECRET=your-session-secret

# AI Services
GEMINI_API_KEY=your-google-ai-api-key
```

### Security Considerations
- **Session Security**: HTTP-only cookies with secure flags in production
- **API Key Protection**: Environment variables for sensitive credentials
- **Authentication**: OAuth integration with Replit's identity system
- **Data Validation**: Zod schemas for all API inputs

## File Structure & Code Organization

### Frontend Structure
```
client/src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Navigation and layout
│   └── ide/             # IDE-specific components
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
└── main.tsx            # Application entry point
```

### Backend Structure
```
server/
├── index.ts            # Express server setup
├── routes.ts           # API route definitions
├── db.ts              # Database connection
├── storage.ts         # Data access layer
├── replitAuth.ts      # Authentication setup
├── gemini.ts          # AI service integration
└── vite.ts            # Development server integration
```

### Shared Resources
```
shared/
└── schema.ts          # Database schema and types
```

## Development Workflow

### Database Migrations
- **Schema Changes**: Update `shared/schema.ts`
- **Migration Command**: `npm run db:push`
- **No Manual SQL**: Drizzle handles schema synchronization

### Local Development
1. **Start Development**: `npm run dev`
2. **Database Setup**: Automatic with Replit PostgreSQL
3. **Hot Reload**: Vite handles frontend, tsx for backend
4. **Port Configuration**: Single port (5000) for both frontend and backend

### Production Deployment
- **Build Process**: `npm run build`
- **Static Assets**: Served via Express in production
- **Environment**: Production-specific configurations
- **Database**: Neon PostgreSQL for scalability

## Data Privacy & Compliance

### User Data Protection
- **Minimal Data Collection**: Only essential profile information
- **Secure Storage**: Encrypted database connections
- **Session Management**: Automatic expiration and cleanup
- **Code Privacy**: User snippets are private by default

### AI Data Usage
- **No Training Data**: User code is not used to train AI models
- **Temporary Processing**: AI requests processed and discarded
- **Fallback Handling**: Graceful degradation when AI services unavailable

## Monitoring & Analytics

### Application Metrics
- **Request Logging**: Automatic API request tracking
- **Error Handling**: Centralized error reporting
- **Performance**: Response time monitoring
- **Database**: Connection pool and query performance

### User Analytics
- **Learning Progress**: Course completion rates
- **Engagement**: IDE usage and AI assistance requests
- **Gamification**: XP earning patterns and badge achievements

## Troubleshooting & Maintenance

### Common Issues
1. **Session Expiration**: Automatic token refresh
2. **Database Connections**: Connection pooling and retry logic
3. **AI Service Errors**: Fallback to placeholder responses
4. **Build Failures**: Clear cache and rebuild

### Maintenance Tasks
- **Database Cleanup**: Session table pruning
- **Log Rotation**: Automatic log management
- **Dependency Updates**: Regular security updates
- **Performance Optimization**: Query optimization and caching

This documentation provides a complete overview of how the GenAI Coding Platform operates, where data is stored, and how all components interact to deliver a comprehensive coding education experience.