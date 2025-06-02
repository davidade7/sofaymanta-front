import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  signinForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.signinForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      // Call the signin method from the auth service
      const { data, error } = await this.authService.signIn(
        this.signinForm.value.email,
        this.signinForm.value.password
      );

      if (error) {
        this.errorMessage = error.message;
      } else {
        // Redirect after successful login
        this.router.navigate(['/dashboard']);
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'Ha ocurrido un error durante el inicio de sesión';
      console.log('Error en el inicio de sesión:', err);
    } finally {
      this.isLoading = false;
    }
  }
}
