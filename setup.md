# SafariTix Full-Stack Setup Guide

## Backend Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/safaritix
# Alternative: MongoDB Atlas connection string
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/safaritix

# JWT Secret (change this to a secure random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup
**Option A: Local MongoDB**
- Install MongoDB on your system
- Start MongoDB service
- The app will connect to `mongodb://localhost:27017/safaritix`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a cluster
- Get your connection string and update `MONGODB_URI` in `.env`

### 4. Start Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Frontend Dependencies
```bash
# From project root
npm install
```

### 2. Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Testing the Setup

### 1. Health Check
Visit `http://localhost:5000/api/health` to verify backend is running.

### 2. Test Authentication
1. Go to `http://localhost:5173/signup`
2. Create a new account
3. Try logging in at `http://localhost:5173/login`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)

### Health Check
- `GET /api/health` - API status

## Features Implemented

### Backend
- ✅ User registration with validation
- ✅ User login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting and security headers
- ✅ CORS configuration
- ✅ Error handling

### Frontend
- ✅ React Context for authentication state
- ✅ Protected routes
- ✅ Form validation
- ✅ Error handling and user feedback
- ✅ Responsive design
- ✅ Token management

## Next Steps

1. **Database Models**: Add more models (Bus, Route, Booking, etc.)
2. **Booking System**: Implement bus booking functionality
3. **Payment Integration**: Add payment processing
4. **Real-time Tracking**: Implement bus tracking
5. **Admin Panel**: Create admin dashboard
6. **Testing**: Add unit and integration tests
7. **Deployment**: Deploy to production

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **CORS Errors**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check if frontend is running on correct port

3. **JWT Token Issues**
   - Ensure `JWT_SECRET` is set in `.env`
   - Check token expiration settings

4. **Port Conflicts**
   - Backend default: 5000
   - Frontend default: 5173
   - Change ports in respective configs if needed




