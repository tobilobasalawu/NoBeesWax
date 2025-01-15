# NoBeeswax Knowledge Base

## Project Overview
Privacy-focused platform for discovering and sharing deals while keeping shopping habits private. Created as an ethical alternative to PayPal Honey and similar tracking-based services. Uses AI to predict and validate discount codes in real-time without compromising user privacy.

### Core Mission
- Provide coupon functionality without tracking
- Keep shopping habits private
- Never collect or sell user data
- Generate codes locally using AI
- Build community-driven alternative to corporate tracking

## Architecture
- Frontend: React + Vite
- Backend: Python Flask API
- Authentication: Clerk
- Database: Firebase (real-time database for posts and user data)
- AI Model: Qwen2-VL-72B hosted locally via Ollama

### AI Model Setup
- Model hosted locally using Ollama
- Use `ollama pull visharxd/coupon-generator` to get the fine-tuned model
- Model provides coupon generation and validation

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
- Firebase used for post storage and retrieval

### Performance
- Lazy load routes when possible
- Optimize images before adding to public folder
- Use proper React.memo() for expensive renders

## Common Tasks
- Start frontend: `cd frontend && npm run dev`
- Start backend: `cd backend && python server.py`
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
- [Firebase Documentation](https://firebase.google.com/docs)

## Development Setup
- Start backend: `cd backend && python server.py`
- Start frontend: `cd frontend && npm run dev`
- Both servers must be running for the app to work
- Backend must be running on port 5000 for frontend API calls to work

## Work in Progress
- Implementing rate limiting
- Improving coupon validation accuracy
- Adding user achievements system
- Enhancing post search with Firebase queries
