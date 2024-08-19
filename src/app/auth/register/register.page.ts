import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { LoadingController } from "@ionic/angular";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/register') {
          this.resetForm();
        }
      }
    });
  }

  onRegister() {
    this.loadingController.create({ message: 'Registering ...' }).then(loadingEl => {
      loadingEl.present();

      this.authService.register(this.registerForm.value).subscribe(
        resData => {
          loadingEl.dismiss();
          this.router.navigateByUrl('/log-in');
        },
        error => {
          loadingEl.dismiss();
        }
      );
    });
  }

  resetForm() {
    if (this.registerForm) {
      this.registerForm.reset();
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control) {
          control.markAsUntouched();
          control.markAsPristine();
          control.updateValueAndValidity();
        }
      });
    }
  }
}
