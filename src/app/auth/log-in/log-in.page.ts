import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "../auth.service";
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

    this.isLoading = true;
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
