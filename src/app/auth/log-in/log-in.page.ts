import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router, NavigationEnd } from "@angular/router";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {
  isLoading = false;
  errorMessage: string = '';

  @ViewChild('logInForm') logInForm!: NgForm;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/log-in') {
          this.resetForm();
        }
      }
    });
  }

  onLogIn(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const enteredEmail = form.value.email;
    const enteredPassword = form.value.password;

    this.isLoading = true;
    this.authService.getAdminsToApprove().subscribe(adminsToApprove => {
        let pendingAdmin = null;

        for (let key in adminsToApprove) {
          if (adminsToApprove[key].email === enteredEmail && adminsToApprove[key].password === enteredPassword) {
            pendingAdmin = adminsToApprove[key];
            break;
          }
        }
        if (pendingAdmin) {
          this.isLoading = false;
          this.errorMessage = 'Waiting for approval, please come back later.';
        } else {
          this.authService.logIn(form.value).subscribe(
            resData => {
              this.isLoading = false;
              this.resetForm();
              this.router.navigateByUrl('/explore');
            },
            error => {
              this.isLoading = false;
              this.errorMessage = 'Invalid email or password. Please try again.';
            }
          );
        }
      },
      error => {
        this.isLoading = false;
        this.errorMessage = 'Error fetching admin approval data. Please try again later.';
      });
  }

  onNavigateToSignUp() {
    this.resetForm();
    this.router.navigateByUrl('/register');
  }

  resetForm() {
    if (this.logInForm) {
      this.logInForm.resetForm();
      Object.keys(this.logInForm.controls).forEach(key => {
        const control = this.logInForm.controls[key];
        control.markAsUntouched();
        control.markAsPristine();
        control.updateValueAndValidity();
        this.errorMessage  = '';
      });
    }
  }
}
