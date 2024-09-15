import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { GameModalComponent } from "./game-modal/game-modal.component";
import {AuthService} from "./services/auth.service";

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

  constructor(private router: Router, private modalCtrl: ModalController, private authService: AuthService) {
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

  openModal() {
    if (this.modalIsOpen) {
      return;
    }
    this.modalIsOpen = true;
    this.modalCtrl.create({
      component: GameModalComponent,
      cssClass: 'custom-modal',
      backdropDismiss: true,
      showBackdrop: false
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then(() => {
        this.modalIsOpen = false;
      });
    });
  }
}
