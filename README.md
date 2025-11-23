# RevTickets - Movie Ticket Booking Application

A modern Angular 18 movie ticket booking web application with a sleek, dark-themed UI similar to BookMyShow/Netflix.

## Features

### User Features
- **Browse Movies**: View now showing and coming soon movies with filters
- **Movie Details**: See movie information, cast, trailers, and reviews
- **Seat Selection**: Interactive cinema-style seat selection with visual layout
- **Booking Flow**: Complete booking with summary, payment, and e-ticket generation
- **User Profile**: Manage profile, view bookings, and payment history
- **Notifications**: Real-time notifications for bookings and offers
- **Reviews & Ratings**: Rate and review movies

### Admin Features
- **Dashboard**: Overview of bookings, revenue, and statistics
- **Movie Management**: Add, edit, and delete movies
- **Showtime Management**: Schedule movie showtimes
- **Theater Management**: Configure theaters and screens
- **Reports**: View analytics and export data

## Tech Stack

- **Angular 18** with standalone components
- **SCSS** for styling
- **RxJS** for reactive programming
- **Angular Signals** for state management

## Project Structure

```
src/
├── app/
│   ├── app.config.ts          # Application configuration
│   ├── app.routes.ts          # Route configuration
│   ├── core/
│   │   ├── guards/            # Auth and Admin guards
│   │   ├── interceptors/      # HTTP interceptors
│   │   └── services/          # Core services
│   ├── shared/
│   │   ├── components/        # Reusable UI components
│   │   ├── models/            # TypeScript interfaces
│   │   └── pipes/             # Custom pipes
│   ├── layout/
│   │   ├── header/            # App header
│   │   └── footer/            # App footer
│   └── features/
│       ├── auth/              # Login/Register
│       ├── movies/            # Movie browsing
│       ├── booking/           # Booking flow
│       ├── profile/           # User profile
│       ├── notifications/     # Notifications
│       └── admin/             # Admin panel
├── styles/
│   ├── _variables.scss        # Design tokens
│   └── _mixins.scss           # SCSS mixins
└── styles.scss                # Global styles
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open http://localhost:4200 in your browser

### Demo Credentials

**User Account:**
- Email: user@revtickets.com
- Password: user123

**Admin Account:**
- Email: admin@revtickets.com
- Password: admin123

## Key Routes

### Public Routes
- `/` - Home page with featured movies
- `/movies` - Movie listing with filters
- `/movies/:id` - Movie details
- `/login` - User login
- `/register` - User registration

### Protected Routes
- `/show/:showId/seats` - Seat selection
- `/booking/:bookingId/summary` - Booking summary
- `/booking/:bookingId/payment` - Payment page
- `/booking/:bookingId/confirmation` - Confirmation with e-ticket
- `/profile` - User profile and bookings
- `/notifications` - Notification center

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/movies` - Movie management
- `/admin/movies/new` - Add movie
- `/admin/movies/:id/edit` - Edit movie
- `/admin/showtimes` - Showtime management
- `/admin/theaters` - Theater management
- `/admin/reports` - Analytics and reports

## Design System

### Colors
- Primary: `#e50914` (Red)
- Background: `#141414` (Dark)
- Text: `#ffffff` / `#b3b3b3`
- Success: `#46d369`
- Warning: `#f5c518`
- Error: `#e50914`

### Typography
- Font: Inter
- Sizes: xs (0.75rem) to 4xl (2.5rem)

## API Integration

The app is designed to work with REST APIs. Currently uses mock services that simulate real API calls with delays. To connect to a real backend:

1. Update service files in `src/app/core/services/`
2. Replace mock data with HTTP calls
3. Configure API base URL in environment files

## Features to Extend

- Real payment gateway integration
- WebSocket for real-time seat availability
- Email/SMS notifications
- Social login (Google, Facebook)
- Multi-language support
- PWA capabilities
- Unit and E2E tests

## License

MIT License
