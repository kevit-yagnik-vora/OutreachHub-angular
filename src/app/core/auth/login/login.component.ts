import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  error = '';
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {}

  ngOnInit() {
    // Get the return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  submit() {
    if (this.form.invalid) {
      this.toast.error('Please fill in all required fields');
      return;
    }

    this.auth
      .login(this.form.value.email ?? '', this.form.value.password ?? '')
      .subscribe({
        next: (user) => {
          // Show success toast
          this.toast.success(`Welcome back, ${user.name || 'User'}!`);

          // Redirect to the return URL after successful login
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (err) => {
          // Extract error message from API response
          // API returns: {"message":"Invalid credentials","error":"Unauthorized","statusCode":401}
          const errorMessage =
            err?.error?.message || err?.message || 'Invalid email or password';

          this.error = errorMessage;
          this.toast.error(errorMessage);
        },
      });
  }
}
