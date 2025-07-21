import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { translateSupabaseError } from '../../services/supabase-error-messages';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.checkPasswords });
  }

  // Check if passwords match in form validation
  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { notMatching: true };
  }

  async onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      // Call the signup method from the auth service
      const { data, error } = await this.authService.signUp(
        this.signupForm.value.email,
        this.signupForm.value.password
      );

      if (error) {
        this.errorMessage = translateSupabaseError(error.message);
      } else {
        // Redirect to signin page with success message
        this.router.navigate(['/signin'], {
          queryParams: { message: '¡Registro exitoso! Por favor verifique su correo electrónico para confirmar su cuenta.' }
        });
      }
    } catch (err: any) {
      this.errorMessage = translateSupabaseError(err.message) || 'Ha ocurrido un error durante el registro';
      console.log('Error en el registro:', err);
    } finally {
      this.isLoading = false;
    }
  }
}
