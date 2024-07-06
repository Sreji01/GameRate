import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import {AnimeModalComponent} from "./anime-modal/anime-modal.component";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  shouldShowHeader: boolean = true;
  shouldShowTabBar: boolean = true;
  modalIsOpen: boolean = false;

  constructor(private router: Router, private modalCtrl: ModalController) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkCurrentRoute(event.urlAfterRedirects || event.url);
      }
    });
  }

  ngOnInit() {
    this.checkCurrentRoute(this.router.url);
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
      component: AnimeModalComponent,
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
