# RevTickets Backend

Spring Boot backend for RevTickets movie ticket booking application.

## Tech Stack

- Java 17+
- Spring Boot 3.2
- Spring Data JPA (MySQL)
- Spring Data MongoDB
- Spring Security with JWT
- WebSockets (STOMP)
- Lombok
- SpringDoc OpenAPI

## Prerequisites

- JDK 17 or higher
- Maven 3.6+
- MySQL 8.0+
- MongoDB 6.0+

## Database Setup

### MySQL
```sql
CREATE DATABASE revtickets;
CREATE USER 'revtickets'@'localhost' IDENTIFIED BY 'revtickets123';
GRANT ALL PRIVILEGES ON revtickets.* TO 'revtickets'@'localhost';
FLUSH PRIVILEGES;
```

### MongoDB
MongoDB should be running on localhost:27017. The database will be created automatically.

## Configuration

Update `src/main/resources/application.yml` with your database credentials if different from defaults.

## Running the Application

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## Default Admin Credentials

After first run, a default admin user is created:
- Email: admin@revtickets.com
- Password: admin123

## API Documentation

Swagger UI: http://localhost:8080/swagger-ui.html

## Project Structure

```
src/main/java/com/revtickets/
├── config/           # Configuration classes
├── controller/       # REST controllers
├── dto/              # Data transfer objects
│   ├── request/      # Request DTOs
│   └── response/     # Response DTOs
├── entity/           # Database entities
│   ├── mysql/        # JPA entities
│   └── mongodb/      # MongoDB documents
├── exception/        # Exception handling
├── repository/       # Data repositories
│   ├── mysql/        # JPA repositories
│   └── mongodb/      # MongoDB repositories
├── security/         # Security configuration
└── service/          # Business logic
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Users
- GET /api/users/me - Get current user profile
- PUT /api/users/me - Update profile
- POST /api/users/me/change-password - Change password

### Movies
- GET /api/movies/now-showing - Get now showing movies
- GET /api/movies/coming-soon - Get coming soon movies
- GET /api/movies/{id} - Get movie details
- GET /api/movies/search - Search movies
- GET /api/movies/filter - Filter movies

### Theaters
- GET /api/theaters - Get all theaters
- GET /api/theaters/city/{city} - Get theaters by city
- GET /api/theaters/cities - Get available cities

### Show Times
- GET /api/showtimes/movie/{movieId} - Get showtimes by movie
- GET /api/showtimes/{id}/seats - Get seat layout

### Bookings
- POST /api/bookings/lock-seats - Lock seats (10 min timeout)
- POST /api/bookings - Create booking
- POST /api/bookings/{id}/cancel - Cancel booking
- GET /api/bookings/my-bookings - Get user's bookings

### Payments
- POST /api/payments/process - Process payment
- POST /api/payments/{bookingId}/refund - Request refund

### Reviews
- GET /api/reviews/movie/{movieId} - Get movie reviews
- POST /api/reviews - Create review
- POST /api/reviews/{id}/like - Like review

### Notifications
- GET /api/notifications - Get notifications
- GET /api/notifications/unread-count - Get unread count
- POST /api/notifications/{id}/read - Mark as read

### Admin
- GET /api/admin/dashboard - Dashboard stats
- POST /api/admin/movies - Create movie
- PUT /api/admin/movies/{id} - Update movie
- DELETE /api/admin/movies/{id} - Delete movie
- POST /api/admin/theaters - Create theater
- POST /api/admin/showtimes - Create showtime

## WebSocket

Connect to `/ws` endpoint for real-time notifications.

Subscribe to: `/user/{userId}/queue/notifications`

## Features

- JWT-based authentication
- Role-based authorization (CUSTOMER, ADMIN)
- Seat locking mechanism with auto-release
- Real-time notifications via WebSocket
- Payment simulation
- Movie reviews with like/dislike
- Admin dashboard with analytics
- Polyglot persistence (MySQL + MongoDB)

## License

MIT
