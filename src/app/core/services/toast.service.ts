import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show a success toast message
   */
  success(message: string, duration: number = 3000) {
    this.snackBar.open(message, '✕', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-success', 'custom-toast'],
    });
  }

  /**
   * Show an error toast message
   */
  error(message: string, duration: number = 4000) {
    this.snackBar.open(message, '✕', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-error', 'custom-toast'],
    });
  }

  /**
   * Show an info toast message
   */
  info(message: string, duration: number = 3000) {
    this.snackBar.open(message, '✕', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-info', 'custom-toast'],
    });
  }

  /**
   * Show a warning toast message
   */
  warning(message: string, duration: number = 3000) {
    this.snackBar.open(message, '✕', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-warning', 'custom-toast'],
    });
  }
}
