# Overview

This is a GenAI-powered coding platform that serves as a futuristic, interactive educational platform for developers. The application combines AI-assisted learning with practical coding features, offering courses, an IDE playground, leaderboard functionality, and real-time AI assistance. The platform targets developers looking to enhance their skills through AI-powered learning paths and competitive programming challenges.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using **React 18** with **TypeScript** and follows a modern component-based architecture:

- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with custom futuristic theming using CSS variables for dark mode support
- **Component Library**: Radix UI components for accessibility and consistency, with shadcn/ui component system
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and interactive effects
- **Code Editor**: Monaco Editor integration for the IDE functionality
- **Build Tool**: Vite for fast development and optimized builds

The frontend follows a page-based structure with shared components, hooks, and utilities. The design emphasizes a futuristic aesthetic with neon colors, glass morphism effects, and space-themed styling.

## Backend Architecture
The backend uses **Node.js** with **Express** in a modern ESM setup:

- **Framework**: Express.js with TypeScript support
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: Replit's OpenID Connect authentication system with session management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **AI Integration**: OpenAI API integration for code assistance, chat functionality, and content generation
- **API Design**: RESTful API structure with proper error handling and request logging

The backend follows a modular structure separating concerns into routes, storage, authentication, and AI services.

## Data Storage Solutions
**Primary Database**: PostgreSQL with Neon serverless configuration for scalability and performance.

**Schema Design**:
- User management with XP, ranking, and badge systems
- Course catalog with AI-generated content support
- User course enrollment tracking
- AI chat session persistence
- Code snippet storage and management
- Session storage for authentication

The database uses Drizzle ORM for type-safe schema definitions and migrations, with automatic UUID generation for primary keys.

## Authentication and Authorization
**Authentication Provider**: Replit's OpenID Connect system for seamless integration within the Replit environment.

**Session Management**: Server-side sessions stored in PostgreSQL with secure HTTP-only cookies.

**Authorization Pattern**: Route-level authentication middleware that checks for valid user sessions before allowing access to protected endpoints.

**User Data**: Integration with Replit's user profile system for email, name, and profile image information.

## External Service Integrations

### OpenAI API Integration
- **GPT-4** for code assistance, debugging, optimization, and explanations
- **Chat completion** for AI tutoring and interactive assistance
- **DALL-E** integration prepared for course thumbnail generation
- **Structured prompts** for different assistance types (debug, optimize, explain, generate, complete)

### Replit Platform Integration
- **Authentication**: Native Replit OpenID Connect integration
- **Development Environment**: Replit-specific development banner and cartographer plugin
- **Error Handling**: Runtime error modal for development mode

### Font and Icon Libraries
- **Google Fonts**: Orbitron for futuristic headings, Inter for body text, JetBrains Mono for code
- **Font Awesome**: Icon library for consistent iconography throughout the platform

### Development and Build Tools
- **Vite**: Fast development server and optimized production builds
- **ESBuild**: Server-side TypeScript compilation and bundling
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **TypeScript**: Full-stack type safety with shared schema definitions