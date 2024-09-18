import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import {AlertController, LoadingController} from "@ionic/angular";
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
    private router: Router,
    private alertCtrl: AlertController
  ) {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      isAdmin: new FormControl(null)
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/register') {
          this.resetForm();
        }
      }
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

  onRegister() {
    const userRole = this.registerForm.get('isAdmin')?.value ? 'admin' : 'user';

    const userData = {
      name: this.registerForm.get('name')?.value,
      surname: this.registerForm.get('surname')?.value,
      username: this.registerForm.get('username')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      role: userRole
    };

    if (userRole === 'user' || (userRole === 'admin' && userData.email === 'admin@gmail.com' && userData.password === 'admin123')) {
      this.loadingController.create({ message: 'Registering...' }).then(loadingEl => {
        loadingEl.present();

        this.authService.register(userData).subscribe(
          () => {
            loadingEl.dismiss();
            this.router.navigateByUrl('/log-in');
          },
          error => {
            loadingEl.dismiss();
            this.showAlert('Registration failed. Please try again.');
          }
        );
      });
    } else if (userRole === 'admin') {

      this.loadingController.create({message: 'Sending register request...'}).then(loadingEl => {
        loadingEl.present();

        this.authService.saveAdminData(userData).subscribe(
          () => {
            loadingEl.dismiss();
            this.showAlert('Admin registration request submitted. Wait for approval.');
          },
          error => {
            loadingEl.dismiss();
            this.showAlert('Error saving user data. Please try again.');
          }
        );
      });
    }
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Alert',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl('/log-in');
            this.resetForm();
          }
        }
      ],
      cssClass: 'custom-alert'
    }).then(alertEl => alertEl.present());
  }
}
