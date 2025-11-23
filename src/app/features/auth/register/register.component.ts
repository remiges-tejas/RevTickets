import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h1>Create Account</h1>
            <p>Join RevTickets and start booking</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <!-- Name -->
            <div class="form-group">
              <label for="fullName" class="form-label">Full Name</label>
              <div class="input-wrapper">
                <span class="input-icon material-icons">person</span>
                <input
                  type="text"
                  id="fullName"
                  formControlName="fullName"
                  placeholder="Enter your full name"
                  class="form-input"
                />
              </div>
              @if (registerForm.get('fullName')?.touched && registerForm.get('fullName')?.invalid) {
                <span class="form-error">Name is required (2-100 characters)</span>
              }
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <div class="input-wrapper">
                <span class="input-icon material-icons">email</span>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  placeholder="Enter your email"
                  class="form-input"
                />
              </div>
              @if (registerForm.get('email')?.touched && registerForm.get('email')?.errors) {
                <span class="form-error">
                  @if (registerForm.get('email')?.errors?.['required']) {
                    Email is required
                  } @else {
                    Please enter a valid email
                  }
                </span>
              }
            </div>

            <!-- Phone -->
            <div class="form-group">
              <label for="phone" class="form-label">Phone Number</label>
              <div class="input-wrapper">
                <span class="input-icon material-icons">phone</span>
                <input
                  type="tel"
                  id="phone"
                  formControlName="phone"
                  placeholder="Enter 10 digit phone number"
                  class="form-input"
                  maxlength="10"
                />
              </div>
              @if (registerForm.get('phone')?.touched && registerForm.get('phone')?.invalid) {
                <span class="form-error">Phone must be exactly 10 digits</span>
              }
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div class="input-wrapper">
                <span class="input-icon material-icons">lock</span>
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  id="password"
                  formControlName="password"
                  placeholder="Create a password"
                  class="form-input"
                />
                <button type="button" class="toggle-password" (click)="togglePassword()">
                  <span class="material-icons">
                    {{ showPassword() ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
              @if (registerForm.get('password')?.touched && registerForm.get('password')?.errors) {
                <span class="form-error">
                  Password must be at least 6 characters
                </span>
              }
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <div class="input-wrapper">
                <span class="input-icon material-icons">lock</span>
                <input
                  type="password"
                  id="confirmPassword"
                  formControlName="confirmPassword"
                  placeholder="Confirm your password"
                  class="form-input"
                />
              </div>
              @if (registerForm.get('confirmPassword')?.touched && registerForm.errors?.['passwordMismatch']) {
                <span class="form-error">Passwords do not match</span>
              }
            </div>

            <!-- Terms -->
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="acceptTerms" />
                <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
              </label>
              @if (registerForm.get('acceptTerms')?.touched && registerForm.get('acceptTerms')?.invalid) {
                <span class="form-error">You must accept the terms</span>
              }
            </div>

            <button type="submit" class="submit-btn" [disabled]="isLoading()">
              @if (isLoading()) {
                <span class="spinner"></span>
                Creating account...
              } @else {
                Create Account
              }
            </button>
          </form>

          <div class="auth-footer">
            <p>
              Already have an account?
              <a routerLink="/login">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: '../login/login.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading.set(true);
    const { fullName, email, password, phone } = this.registerForm.value;

    this.authService.register({ fullName, email, password, phone }).subscribe({
      next: () => {
        this.toastService.success('Account created successfully! Welcome to RevTickets.');
        this.router.navigate(['/']);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastService.error('Registration failed. Please try again.');
      }
    });
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}
