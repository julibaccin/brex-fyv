import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alert: AlertsService
  ) {}

  ngOnInit(): void {}

  async resetPassword() {
    try {
      await this.auth.recoverPassword(this.loginForm.value.email);
      this.alert.success(
        'Se ha enviado un mail de recuperación, verifique su correo'
      );
    } catch (error) {
      console.log(error);
      this.alert.error(
        'En estos momentos, ésta funcionalidad no está disponible'
      );
    }
  }

  async handleLogin() {
    try {
      if (this.loginForm.valid) {
        const { email, password } = this.loginForm.value;
        await this.auth.login(email, password);
        this.router.navigateByUrl('/panel');
      } else {
        this.alert.error('Formulario inválido');
      }
    } catch (error) {
      this.alert.error('Usuario o contraseña incorrecto');
    }
  }
}
