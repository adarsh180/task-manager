# Task Tracker Manager - AI-Powered Study Assistant

A modern, real-time task management application built with Next.js 14, featuring AI chatbot integration, Pomodoro technique, note-taking, and comprehensive dashboard analytics. Specifically designed for UPSC, NEET UG, IIT/JEE, CSIR UGC-NET, NEET PG, Coding, DSA, and AI/ML aspirants.

## Site Link
https://taskmanager-MA.netlify.app

## Features

- **AI Study Assistant**: ChatGPT-like interface with exam-specific training for UPSC, NEET, JEE, and more
- **Enhanced Authentication**: Google OAuth integration with beautiful animated login/register pages
- **Code Generation**: Advanced code block rendering with syntax highlighting and copy functionality
- **Chat History**: Sidebar with chat sessions, create new chats, delete old conversations
- **Dashboard**: Real-time statistics and overview of all activities
- **Task Management**: Create, update, delete, and track tasks with priorities and due dates
- **Notes**: Rich note-taking functionality with real-time updates
- **Pomodoro Timer**: Built-in Pomodoro technique timer with session tracking
- **Profile Management**: User profile with productivity insights and exam-specific stats
- **Real-time Updates**: All data syncs in real-time across the application
- **Modern UI/UX**: Beautiful animations, gradient backgrounds, and responsive design
- **Dark/Light Theme**: Modern UI with theme switching support

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL (Neon.tech) with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth, JWT tokens, bcryptjs for password hashing
- **AI Integration**: DeepSeek API for exam-specific AI assistance
- **UI Components**: Radix UI primitives with custom styling
- **Real-time**: Server-sent events for live data updates

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env` and update with your values
   - Add your OpenRouter API key for DeepSeek AI
   - Configure Google OAuth credentials
   - Set up Neon.tech PostgreSQL database URL
   - Generate secure JWT and NextAuth secrets

3. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`
6. **Register** a new account and select your exam type
7. **Start chatting** with the AI assistant for your specific exam preparation

## Database Schema

The application uses the following models:
- **User**: User profiles and authentication
- **Task**: Task management with status, priority, and due dates
- **Note**: Note-taking functionality
- **PomodoroSession**: Pomodoro timer session tracking

## API Endpoints

- `GET/POST /api/tasks` - Task management
- `PUT/DELETE /api/tasks/[id]` - Individual task operations
- `GET/POST /api/notes` - Notes management
- `GET/POST /api/pomodoro` - Pomodoro session tracking
- `POST /api/init` - Database initialization

## Features in Detail

### Enhanced Authentication
- Google OAuth integration for quick signup/signin
- Beautiful animated login/register pages
- Secure JWT-based authentication
- User profile management

### Dashboard
- Real-time statistics cards
- Task completion rates
- Pomodoro session tracking
- Notes overview

### Task Management
- Create tasks with titles, descriptions, priorities, and due dates
- Update task status (TODO, IN_PROGRESS, COMPLETED)
- Priority levels (LOW, MEDIUM, HIGH, URGENT)
- Real-time task updates

### Pomodoro Timer
- 25-minute work sessions
- 5-minute short breaks
- 15-minute long breaks
- Automatic session switching
- Session history tracking
- Browser notifications

### Notes
- Create and edit rich text notes
- Real-time note synchronization
- Search and organize notes
- Timestamp tracking

### Profile
- User information management
- Productivity statistics
- Completion rate tracking
- Activity insights

## Customization

The application is highly customizable:
- Modify timer durations in `components/pomodoro-timer.tsx`
- Customize themes in `app/globals.css`
- Add new task priorities in `prisma/schema.prisma`
- Extend API functionality in `app/api/` routes

## Environment Setup

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env` file

### Neon.tech Database Setup
1. Sign up at [Neon.tech](https://neon.tech/)
2. Create a new PostgreSQL database
3. Copy the connection string to `DATABASE_URL` in your `.env` file

## Deployment

The application can be deployed to any platform supporting Next.js:
- Vercel (recommended)
- Netlify
- Railway
- Self-hosted

The application is already configured for PostgreSQL production deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.