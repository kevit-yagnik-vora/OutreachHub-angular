import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get the return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  submit() {
    if (this.form.invalid) return;
    this.auth
      .login(this.form.value.email ?? '', this.form.value.password ?? '')
      .subscribe({
        next: () => {
          // Redirect to the return URL after successful login
          this.router.navigateByUrl(this.returnUrl);
        },
        error: () => (this.error = 'Invalid credentials'),
      });
  }
}
