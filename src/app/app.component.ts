import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import {AlertController, ModalController} from "@ionic/angular";
import { ReviewModalComponent } from "./review-modal/review-modal.component";
import {AuthService} from "./services/auth.service";
import {GameModalComponent} from "./game-modal/game-modal.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  shouldShowHeader: boolean = true;
  shouldShowTabBar: boolean = true;
  modalIsOpen: boolean = false;
  username: string = '';
  role: string = '';

  constructor(private router: Router,
              private modalCtrl: ModalController,
              private authService: AuthService,
              private alertCtrl: AlertController) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkCurrentRoute(event.urlAfterRedirects || event.url);
      }
    });
  }

  ngOnInit() {
    this.checkCurrentRoute(this.router.url);
    this.authService.userId.subscribe(userId => {
      if (userId) {
        this.authService.getUserData(userId).subscribe(
          userData => {
            this.username = userData.username || '';
            this.role = userData.role || ''
            this.authService.getAdminsToApprove().subscribe((data) => {
              this.authService.setAdminRequestCount(Object.keys(data).length);
            });
          },
          error => {
            console.error('Failed to fetch user data:', error);
          }
        );
      }
    });
  }

  private checkCurrentRoute(url: string) {
    const noHeaderFooterRoutes = ['/log-in', '/register'];
    this.shouldShowHeader = !noHeaderFooterRoutes.includes(url);
    this.shouldShowTabBar = !noHeaderFooterRoutes.includes(url);
  }

  async openModal() {
    if (this.modalIsOpen) {
      return;
    }

    if (this.role === 'admin') {
      const alert = await this.alertCtrl.create({
        header: 'Choose Action',
        message: 'What would you like to add?',
        cssClass: 'custom-alert',
        buttons: [
          {
            text: 'Add Review',
            handler: () => {
              this.modalIsOpen = true;
              this.modalCtrl.create({
                component: ReviewModalComponent,
                cssClass: 'custom-modal',
                backdropDismiss: true,
                showBackdrop: false,
              }).then((modal) => {
                modal.present();
                modal.onDidDismiss().then(() => {
                  this.modalIsOpen = false;
                });
              });
            }
          },
          {
            text: 'Add Game',
            handler: () => {
              this.modalIsOpen = true;
              this.modalCtrl.create({
                component: GameModalComponent,
                cssClass: 'custom-modal',
                backdropDismiss: true,
                showBackdrop: false,
                componentProps: {
                  role: this.role
                }
              }).then((modal) => {
                modal.present();
                modal.onDidDismiss().then(() => {
                  this.modalIsOpen = false;
                });
              });
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('User cancelled the action');
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.modalIsOpen = true;
      this.modalCtrl.create({
        component: ReviewModalComponent,
        cssClass: 'custom-modal',
        backdropDismiss: true,
        showBackdrop: false,
        componentProps: {
          role: this.role
        }
      }).then((modal) => {
        modal.present();
        modal.onDidDismiss().then(() => {
          this.modalIsOpen = false;
        });
      });
    }
  }

}
