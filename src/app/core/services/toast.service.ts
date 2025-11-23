import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  private defaultDuration = 4000;

  show(message: string, type: Toast['type'] = 'info', duration?: number): void {
    const id = Date.now().toString();
    const toast: Toast = {
      id,
      message,
      type,
      duration: duration || this.defaultDuration
    };

    this.toastsSignal.update(toasts => [...toasts, toast]);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(id);
    }, toast.duration);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  remove(id: string): void {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }

  clear(): void {
    this.toastsSignal.set([]);
  }
}
