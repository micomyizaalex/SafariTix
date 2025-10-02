# SafariTix PHP Backend

A simple PHP backend API for the SafariTix application.

## Setup

1. **Database Setup**
   - Import the database schema: `database/schema.sql`
   - Update database credentials in `config/database.php`

2. **Web Server**
   - Place the backend folder in your web server directory (e.g., `htdocs`, `www`)
   - Ensure mod_rewrite is enabled for Apache
   - For development, you can use PHP's built-in server:
     ```bash
     php -S localhost:8000 -t backend
     ```

3. **Database Configuration**
   - Update `config/database.php` with your MySQL credentials
   - Default settings:
     - Host: localhost
     - Database: safaritix
     - Username: root
     - Password: (empty)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires token)

### Health Check
- `GET /api/health` - API health status

## Frontend Integration

Update your frontend API base URL to point to your PHP backend:
- Development: `http://localhost:8000/api`
- Production: `http://yourdomain.com/api`

## Sample Requests

### Signup
```json
POST /api/auth/signup
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+250700000000",
    "password": "password123"
}
```

### Login
```json
POST /api/auth/login
{
    "email": "john@example.com",
    "password": "password123"
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```
