import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  username: string = '';
  email: string = '';
  password: string = '';
  fullName: string = '';  // Add this line
  private userSub: Subscription = new Subscription();
  private loadingSub: Subscription = new Subscription();
  isLoading = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadingSub = this.authService.isLoading.subscribe(loading => {
      this.isLoading = loading;
    });

    this.userSub = this.authService.userId.subscribe(userId => {
      if (userId) {
        this.authService.getUserData(userId).subscribe(
          userData => {
            this.username = userData.username || '';
            this.email = userData.email || '';
            this.password = userData.password || '';
            this.fullName = `${userData.name || ''} ${userData.surname || ''}`; // Set full name
          },
          error => {
            console.error('Failed to fetch user data:', error);
          }
        );
      }
    });
  }

  onLogOut() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }
}
