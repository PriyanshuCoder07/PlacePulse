# PlacePulse

A full-stack web application for sharing and discovering travel experiences. Built with React, Express, MongoDB, and Firebase.

## Project Structure

```
PlacePulse/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Auth, Theme)
│   │   ├── lib/           # Utility functions
│   │   └── assets/        # Static assets
│   └── package.json
│
└── backend/           # Express.js backend API
    ├── src/
    │   ├── config/        # Configuration files (DB, Firebase)
    │   ├── routes/        # API routes
    │   ├── models/        # MongoDB models
    │   ├── middleware/    # Express middleware
    │   └── index.js       # Server entry point
    └── package.json
```

## Features

- 🔐 **Authentication**: Firebase-based user authentication
- 📱 **Experience Sharing**: Create and share travel experiences
- 🎨 **Theme Support**: Light/Dark theme switching
- 📊 **Analytics**: Admin dashboard with analytics
- 🔍 **Search & Filter**: Find experiences by location and category
- ✅ **User Verification**: Admin panel for experience moderation

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Firebase** - Authentication
- **React Router** - Routing
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Firebase Admin SDK** - Backend authentication
- **JWT** - Token-based auth
- **CORS** - Cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance
- Firebase project with service account credentials
- npm or yarn

### Installation

#### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
FIREBASE_PROJECT_ID=your_firebase_project_id
```

Also, create `src/config/serviceAccount.json` with your Firebase service account credentials.

#### Frontend Setup
```bash
cd frontend
npm install
```

Update `src/firebase.js` with your Firebase project configuration.

### Running the Application

**Backend** (from `backend` directory):
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

**Frontend** (from `frontend` directory):
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend will run at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `CLIENT_URL` - Frontend URL for CORS
- `JWT_SECRET` - Secret key for JWT tokens (if used)
- Firebase admin credentials via `serviceAccount.json`

### Frontend
- Configure Firebase credentials in `src/firebase.js`
- API base URL configured in `src/lib/axios.js`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Experiences
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get experience details
- `POST /api/experiences` - Create new experience (authenticated)
- `PUT /api/experiences/:id` - Update experience (owner only)
- `DELETE /api/experiences/:id` - Delete experience (owner only)

### Admin
- `GET /api/admin/stats` - Get analytics data
- `GET /api/admin/experiences` - Get all experiences for review
- `PUT /api/admin/experiences/:id/verify` - Verify/approve experience

## Security Notes

⚠️ **Important**: 
- Never commit `.env` files or Firebase service account keys
- Keep `serviceAccount.json` secure and out of version control
- Use environment variables for all sensitive data
- Validate and sanitize all user inputs
- Implement rate limiting in production

## Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For issues or questions, please create an issue on GitHub.
