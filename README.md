# Project Management Platform

A full-stack project management application inspired by Basecamp, featuring user authentication, project management, task tracking with subtasks, file attachments, and collaborative notes.

## Project Structure

```
project-management-platform/
├── backend/                 # Node.js/Express REST API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware (auth, validation, etc.)
│   │   ├── models/          # Database models (Mongoose schemas)
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # Utility functions
│   │   ├── validators/      # Input validation schemas
│   │   ├── app.js           # Express app configuration
│   │   └── index.js         # Application entry point
│   ├── .env                 # Environment variables
│   └── package.json         # Backend dependencies and scripts
├── frontend/                # React/Vite SPA
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main application component
│   │   ├── main.jsx         # Application entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── .env                 # Frontend environment variables
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies and scripts
│   ├── tailwind.config.cjs  # Tailwind CSS configuration
│   ├── postcss.config.cjs   # PostCSS configuration
│   └── vite.config.js       # Vite configuration
├── .gitignore               # Git ignore rules
└── package.json             # Root package.json with workspace scripts
```

## Features

### Backend API
- **Authentication & Authorization**: JWT-based auth with role-based access control (Admin, Project Admin, Member)
- **Project Management**: Create, read, update, delete projects
- **Team Management**: Add/remove members, update roles within projects
- **Task Management**: Create tasks with assignees, status tracking (To Do, In Progress, Done)
- **Subtasks**: Hierarchical task breakdown with completion tracking
- **File Attachments**: Upload multiple files to tasks
- **Project Notes**: Collaborative notes system (Admin-only creation)
- **Email Verification**: Account verification and password reset functionality
- **RESTful API**: Well-documented endpoints following REST principles

### Frontend Application
- **Modern UI**: Inspired by Basecamp's clean, intuitive interface
- **Authentication Flow**: Login, registration, password reset
- **Project Dashboard**: Overview of all projects with key metrics
- **Project Detail View**: Task boards, notes, and team management
- **Responsive Design**: Works on desktop and mobile devices
- **State Management**: React Context for authentication state
- **Form Validation**: Client-side validation with user feedback
- **Loading States**: UX-friendly loading indicators
- **Error Handling**: Graceful error recovery and messaging

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Express Validator
- **File Uploads**: Multer
- **Email Service**: Nodemailer with Mailgen templates
- **Security**: Bcrypt for password hashing, CORS, Helmet

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Form Handling**: React Hook Form (if implemented)

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas cluster)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd project-management-platform
   ```

2. Install dependencies for both backend and frontend:
   ```bash
   npm run install-all
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in both `backend/` and `frontend/` directories
   - Update the values according to your environment

4. Start the development servers:
   ```bash
   npm run dev
   ```
   This will start both backend (http://localhost:3000) and frontend (http://localhost:5173) concurrently.

### Available Scripts

From the project root:
- `npm run install-all` - Install dependencies for both workspaces
- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:backend` - Start only the backend server
- `npm run dev:frontend` - Start only the frontend server
- `npm run start` - Start the backend in production mode

From within `backend/` directory:
- `npm run dev` - Start backend in development mode
- `npm run start` - Start backend in production mode

From within `frontend/` directory:
- `npm run dev` - Start frontend in development mode
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build

## API Documentation

The backend provides a RESTful API with the following endpoints:

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/current-user` - Get current user info
- `POST /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/verify-email/:token` - Verify email
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password/:token` - Reset password
- `POST /api/v1/auth/resend-email-verification` - Resend verification email

### Projects
- `GET /api/v1/projects/` - List user's projects
- `POST /api/v1/projects/` - Create new project
- `GET /api/v1/projects/:projectId` - Get project details
- `PUT /api/v1/projects/:projectId` - Update project
- `DELETE /api/v1/projects/:projectId` - Delete project
- `GET /api/v1/projects/:projectId/members` - List project members
- `POST /api/v1/projects/:projectId/members` - Add project member
- `PUT /api/v1/projects/:projectId/members/:userId` - Update member role
- `DELETE /api/v1/projects/:projectId/members/:userId` - Remove member

### Tasks
- `GET /api/v1/tasks/:projectId` - List project tasks
- `POST /api/v1/tasks/:projectId` - Create task
- `GET /api/v1/tasks/:projectId/t/:taskId` - Get task details
- `PUT /api/v1/tasks/:projectId/t/:taskId` - Update task
- `DELETE /api/v1/tasks/:projectId/t/:taskId` - Delete task
- `POST /api/v1/tasks/:projectId/t/:taskId/subtasks` - Create subtask
- `PUT /api/v1/tasks/:projectId/st/:subTaskId` - Update subtask
- `DELETE /api/v1/tasks/:projectId/st/:subTaskId` - Delete subtask

### Notes
- `GET /api/v1/notes/:projectId` - List project notes
- `POST /api/v1/notes/:projectId` - Create note
- `GET /api/v1/notes/:projectId/n/:noteId` - Get note details
- `PUT /api/v1/notes/:projectId/n/:noteId` - Update note
- `DELETE /api/v1/notes/:projectId/n/:noteId` - Delete note

### Health Check
- `GET /api/v1/healthcheck/` - System health status

## Deployment

### Backend Deployment
The backend can be deployed to any Node.js hosting platform:
1. Ensure MongoDB connection string is set in environment variables
2. Build is not required (runs directly from source)
3. Use process manager like PM2 for production

### Frontend Deployment
The frontend builds to static assets that can be hosted anywhere:
1. Run `npm run build` in the frontend directory
2. Deploy the contents of the `dist` folder to any static hosting service
3. Configure API URL in `.env` file for production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Basecamp's project management philosophy
- Built with modern JavaScript/TypeScript practices
- Following RESTful API design principles