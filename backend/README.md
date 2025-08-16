# TinyLearn Backend API

A robust Node.js/Express backend API for TinyLearn, an early learning platform designed for children aged 2-7 years.

## Features

- 🔐 **User Authentication** - JWT-based authentication with role-based access control
- 👥 **User Management** - Support for students, teachers, parents, and admins
- 📚 **Lesson Management** - CRUD operations for educational content
- 📊 **Progress Tracking** - Monitor student learning progress and statistics
- 🗄️ **Database Integration** - MySQL with Sequelize ORM
- 🔒 **Security** - Password hashing with Argon2, input validation
- 🌐 **CORS Support** - Cross-origin resource sharing for frontend integration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Argon2
- **Environment**: dotenv
- **Logging**: Morgan
- **File Upload**: Multer

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── config.js          # Database configuration
│   ├── controllers/
│   │   ├── UserController.js   # User-related operations
│   │   ├── LessonController.js # Lesson management
│   │   └── ProgressController.js # Progress tracking
│   ├── middleware/
│   │   └── user-guard.js       # JWT authentication middleware
│   ├── models/
│   │   ├── database.js         # Database connection and setup
│   │   ├── User.js            # User model
│   │   ├── Lesson.js          # Lesson model
│   │   ├── Progress.js        # Progress model
│   │   └── index.js           # Model associations
│   ├── routes/
│   │   ├── UserRoutes.js      # User API routes
│   │   ├── LessonRoutes.js    # Lesson API routes
│   │   └── ProgressRoutes.js  # Progress API routes
│   ├── utils/
│   │   └── response.js        # Standardized API responses
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
├── .env                       # Environment variables
├── seed.js                    # Database seeding script
└── package.json               # Dependencies and scripts
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tinylearn-frontend/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   HOST=localhost
   USER=root
   PASSWORD=your_mysql_password
   DIALECT=mysql
   DB_NAME=tinylearn_db
   SECRET_KEY=your_super_secret_jwt_key
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=development
   ```

4. **Database Setup**
   - Create a MySQL database named `tinylearn_db`
   - The tables will be created automatically when you start the server

5. **Seed the Database (Optional)**
   ```bash
   npm run seed
   ```
   This creates sample users and lessons for testing.

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login

### User Management
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `GET /api/users/all` - Get all users (Admin only)

### Lessons
- `GET /api/lessons` - Get all lessons (with pagination and filters)
- `GET /api/lessons/:id` - Get specific lesson
- `GET /api/lessons/category/:category` - Get lessons by category
- `POST /api/lessons` - Create new lesson (Teacher/Admin only)
- `PUT /api/lessons/:id` - Update lesson (Creator/Admin only)
- `DELETE /api/lessons/:id` - Delete lesson (Creator/Admin only)

### Progress Tracking
- `GET /api/progress` - Get user's progress
- `GET /api/progress/stats` - Get progress statistics
- `GET /api/progress/lesson/:lessonId` - Get progress for specific lesson
- `POST /api/progress/lesson/:lessonId/start` - Start a lesson
- `PUT /api/progress/lesson/:lessonId` - Update lesson progress
- `PUT /api/progress/lesson/:lessonId/complete` - Complete a lesson
- `GET /api/progress/all` - Get all progress (Admin/Teacher only)

### Health Check
- `GET /api/health` - API health check

## User Roles

- **Student**: Can view lessons, track progress
- **Teacher**: Can create/edit lessons, view student progress
- **Parent**: Can view child's progress
- **Admin**: Full access to all features

## Sample Users (After Seeding)

- **Admin**: admin@tinylearn.com / Admin123!
- **Teacher**: teacher@tinylearn.com / Teacher123!
- **Student**: student@tinylearn.com / Student123!

## Database Models

### User
- id, firstName, lastName, email, password
- role (student/teacher/parent/admin)
- age, grade, parentEmail
- isActive, lastLogin, profilePicture

### Lesson
- id, title, description, content
- category (math/reading/science/art/music/physical/social)
- difficulty (beginner/intermediate/advanced)
- ageGroup, duration, imageUrl, videoUrl
- isActive, createdBy

### Progress
- id, userId, lessonId
- status (not_started/in_progress/completed)
- score, timeSpent, completedAt, notes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.
