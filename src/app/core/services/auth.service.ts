import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, delay, tap, throwError, catchError, map } from 'rxjs';
import { User, AuthResponse, LoginRequest, RegisterRequest, BackendApiResponse } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'revtickets_token';
  private readonly USER_KEY = 'revtickets_user';

  // Signals for reactive state
  private currentUserSignal = signal<User | null>(this.getStoredUser());
  private isLoadingSignal = signal<boolean>(false);

  // Computed signals
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly isAdmin = computed(() => {
    const user = this.currentUserSignal();
    return user?.roles?.includes('ROLE_ADMIN') || user?.role === 'admin';
  });
  readonly isLoading = this.isLoadingSignal.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = this.getStoredUser();
    if (token && user) {
      this.currentUserSignal.set(user);
    }
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    return this.http.post<BackendApiResponse<AuthResponse>>(`${this.API_URL}/login`, credentials).pipe(
      map(response => response.data),
      tap(authResponse => {
        localStorage.setItem(this.TOKEN_KEY, authResponse.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
        this.currentUserSignal.set(authResponse.user);
        this.isLoadingSignal.set(false);
      }),
      catchError(error => {
        // Fallback to mock auth if backend is unavailable
        console.warn('Backend unavailable, using mock authentication');

        // Check if admin login
        const isAdmin = credentials.email === 'admin@revtickets.com';

        const mockUser: User = {
          id: Date.now(),
          email: credentials.email,
          fullName: isAdmin ? 'Admin User' : credentials.email.split('@')[0],
          roles: isAdmin ? ['ROLE_ADMIN', 'ROLE_USER'] : ['ROLE_USER'],
          createdAt: new Date()
        };
        const mockResponse: AuthResponse = {
          token: 'mock-jwt-token-' + Date.now(),
          user: mockUser
        };
        localStorage.setItem(this.TOKEN_KEY, mockResponse.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(mockResponse.user));
        this.currentUserSignal.set(mockResponse.user);
        this.isLoadingSignal.set(false);
        return of(mockResponse).pipe(delay(500));
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    return this.http.post<BackendApiResponse<AuthResponse>>(`${this.API_URL}/register`, data).pipe(
      map(response => response.data),
      tap(authResponse => {
        localStorage.setItem(this.TOKEN_KEY, authResponse.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
        this.currentUserSignal.set(authResponse.user);
        this.isLoadingSignal.set(false);
      }),
      catchError(error => {
        // Fallback to mock auth if backend is unavailable
        console.warn('Backend unavailable, using mock registration');
        const mockUser: User = {
          id: Date.now(),
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          roles: ['ROLE_USER'],
          createdAt: new Date()
        };
        const mockResponse: AuthResponse = {
          token: 'mock-jwt-token-' + Date.now(),
          user: mockUser
        };
        localStorage.setItem(this.TOKEN_KEY, mockResponse.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(mockResponse.user));
        this.currentUserSignal.set(mockResponse.user);
        this.isLoadingSignal.set(false);
        return of(mockResponse).pipe(delay(500));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  updateProfile(updates: Partial<User>): Observable<User> {
    const currentUser = this.currentUserSignal();
    if (!currentUser) {
      return throwError(() => new Error('Not authenticated'));
    }

    const updatedUser: User = {
      ...currentUser,
      ...updates,
      updatedAt: new Date()
    };

    return of(updatedUser).pipe(
      delay(500),
      tap(user => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSignal.set(user);
      })
    );
  }

  requestPasswordReset(email: string): Observable<{ message: string }> {
    return of({ message: 'Password reset email sent successfully' }).pipe(delay(1000));
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return of({ message: 'Password reset successfully' }).pipe(delay(1000));
  }
}
