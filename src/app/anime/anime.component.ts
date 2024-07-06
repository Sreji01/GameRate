import {Component, Input, OnInit} from '@angular/core';
import {Anime} from "../anime.model";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.scss'],
})
export class AnimeComponent  implements OnInit {

  @Input() anime!: Anime
  constructor(private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {}

  async openAlert(event: MouseEvent) {
    event.preventDefault();
    const alert = await this.alertCtrl.create({
      message: "Do you want to add this to your watchlist?",
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            console.log('User clicked Yes');
          }

        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('User clicked No');
          }
        }
      ]
    });

    await alert.present();
  }

  navigateToDetails(animeId: string, event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('watchlist-icon')) {
      return;
    }

    const currentUrl = this.router.url;
    const baseUrl = currentUrl.split('/')[1];
    this.router.navigateByUrl(`/${baseUrl}/anime-details/${animeId}`);
  }
}
