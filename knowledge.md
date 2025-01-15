# NoBeeswax Knowledge Base

## Project Overview
Privacy-focused platform for discovering and sharing deals while keeping shopping habits private. Uses AI to predict and validate discount codes in real-time.

## Architecture
- Frontend: React + Vite
- Backend: Python Flask API
- Authentication: Clerk
- Database: ChromaDB (vector database for posts)

## Key Components
- CouponHunt: AI-powered coupon code generator
- Posts: Community-verified coupon sharing with ChromaDB backend
- COTD: Curated daily deals
- Dashboard: User statistics and activity
- Leaderboard: Gamification system

## Development Guidelines

### Authentication
- Use Clerk for all auth-related functionality
- Protected routes should use SignedIn component
- Redirect unauthenticated users to /sign-in
- Sign-in/up routes must use wildcard paths (e.g., "/sign-in/*") to support OAuth callbacks

### State Management
- Use React hooks for local state
- Prefer lifting state up over complex state management
- Keep API calls in the page components

### Styling
- CSS modules for component-specific styles
- Dark theme is default, light theme as toggle option
- Consistent spacing using CSS variables
- Animations for better UX (fadeIn, etc.)

### API Integration
- Backend runs on port 5000
- All API endpoints should include error handling
- Use try/catch blocks for async operations
- Log all API calls and errors
- ChromaDB used for post storage and retrieval

### Performance
- Lazy load routes when possible
- Optimize images before adding to public folder
- Use proper React.memo() for expensive renders

## Common Tasks
- Start frontend: `cd frontend && npm run dev`
- Start backend: `cd backend && python model.py`
- Install new frontend package: `cd frontend && npm install <package>`

## API Endpoints
- Backend runs on port 5000
- Frontend runs on port 5173 (or next available port)
- Available endpoints:
  - POST /generate-coupon: Generate AI-powered coupon for a retailer
  - POST /analyze: Analyze Reddit for coupon images

## Links
- [Clerk Documentation](https://clerk.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [ChromaDB Documentation](https://docs.trychroma.com/)

## Development Setup
- Start backend: `cd backend && python server.py`
- Start frontend: `cd frontend && npm run dev`
- Both servers must be running for the app to work
- Backend must be running on port 5000 for frontend API calls to work

## Work in Progress
- Implementing rate limiting
- Improving coupon validation accuracy
- Adding user achievements system
- Enhancing post search with ChromaDB embeddings

## Firebase Setup
- Firebase config must be in `.env` file in frontend directory
- Never commit firebase.js with actual credentials
- Use .env.example to show required environment variables
- Required env vars:
  - VITE_FIREBASE_API_KEY
  - VITE_FIREBASE_AUTH_DOMAIN
  - VITE_FIREBASE_PROJECT_ID
  - VITE_FIREBASE_STORAGE_BUCKET
  - VITE_FIREBASE_MESSAGING_SENDER_ID
  - VITE_FIREBASE_APP_ID
