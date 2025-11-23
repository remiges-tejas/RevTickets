import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Public Routes
  {
    path: '',
    loadComponent: () => import('./features/movies/home/home.component').then(m => m.HomeComponent),
    title: 'RevTickets - Home'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Login - RevTickets'
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    title: 'Register - RevTickets'
  },
  {
    path: 'movies',
    loadComponent: () => import('./features/movies/movie-list/movie-list.component').then(m => m.MovieListComponent),
    title: 'Movies - RevTickets'
  },
  {
    path: 'movies/:id',
    loadComponent: () => import('./features/movies/movie-details/movie-details.component').then(m => m.MovieDetailsComponent),
    title: 'Movie Details - RevTickets'
  },

  // Booking Flow (Protected)
  {
    path: 'show/:showId/seats',
    loadComponent: () => import('./features/booking/seat-selection/seat-selection.component').then(m => m.SeatSelectionComponent),
    canActivate: [authGuard],
    title: 'Select Seats - RevTickets'
  },
  {
    path: 'booking/:bookingId/summary',
    loadComponent: () => import('./features/booking/booking-summary/booking-summary.component').then(m => m.BookingSummaryComponent),
    canActivate: [authGuard],
    title: 'Booking Summary - RevTickets'
  },
  {
    path: 'booking/:bookingId/payment',
    loadComponent: () => import('./features/booking/payment/payment.component').then(m => m.PaymentComponent),
    canActivate: [authGuard],
    title: 'Payment - RevTickets'
  },
  {
    path: 'booking/:bookingId/confirmation',
    loadComponent: () => import('./features/booking/confirmation/confirmation.component').then(m => m.ConfirmationComponent),
    canActivate: [authGuard],
    title: 'Booking Confirmed - RevTickets'
  },

  // User Protected Routes
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'My Profile - RevTickets'
  },
  {
    path: 'notifications',
    loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [authGuard],
    title: 'Notifications - RevTickets'
  },

  // Admin Routes
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard - RevTickets'
      },
      {
        path: 'movies',
        loadComponent: () => import('./features/admin/movies/admin-movies.component').then(m => m.AdminMoviesComponent),
        title: 'Manage Movies - RevTickets'
      },
      {
        path: 'movies/new',
        loadComponent: () => import('./features/admin/movies/movie-form/movie-form.component').then(m => m.MovieFormComponent),
        title: 'Add Movie - RevTickets'
      },
      {
        path: 'movies/:id/edit',
        loadComponent: () => import('./features/admin/movies/movie-form/movie-form.component').then(m => m.MovieFormComponent),
        title: 'Edit Movie - RevTickets'
      },
      {
        path: 'showtimes',
        loadComponent: () => import('./features/admin/showtimes/admin-showtimes.component').then(m => m.AdminShowtimesComponent),
        title: 'Manage Showtimes - RevTickets'
      },
      {
        path: 'theaters',
        loadComponent: () => import('./features/admin/theaters/admin-theaters.component').then(m => m.AdminTheatersComponent),
        title: 'Manage Theaters - RevTickets'
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/admin/reports/admin-reports.component').then(m => m.AdminReportsComponent),
        title: 'Reports - RevTickets'
      }
    ]
  },

  // Static Pages
  {
    path: 'about',
    loadComponent: () => import('./features/pages/about/about.component').then(m => m.AboutComponent),
    title: 'About Us - RevTickets'
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact Us - RevTickets'
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/pages/faq/faq.component').then(m => m.FaqComponent),
    title: 'FAQs - RevTickets'
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/pages/terms/terms.component').then(m => m.TermsComponent),
    title: 'Terms of Use - RevTickets'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/pages/privacy/privacy.component').then(m => m.PrivacyComponent),
    title: 'Privacy Policy - RevTickets'
  },

  // Wildcard Route
  {
    path: '**',
    redirectTo: ''
  }
];
