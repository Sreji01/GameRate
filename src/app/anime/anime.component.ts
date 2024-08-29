import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Anime } from "../anime.model";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { WatchlistService } from "../services/watchlist.service";

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.scss'],
})
export class AnimeComponent implements OnInit {
  @Input() anime!: Anime;
  @Output() animeRemoved = new EventEmitter<string>();
  isInWatchlist: boolean = false;

  constructor(private router: Router, private alertCtrl: AlertController, private watchlistService: WatchlistService) { }

  ngOnInit() {
    this.checkWatchlistStatus();
  }

  checkWatchlistStatus() {
    this.watchlistService.isAnimeInWatchlist(this.anime.id).subscribe(isInWatchlist => {
      this.isInWatchlist = isInWatchlist;
    });
  }

  async openAlert(event: MouseEvent) {
    event.preventDefault();

    if (this.isInWatchlist) {
      this.watchlistService.removeFromWatchlist(this.anime.id).subscribe(async () => {
        this.isInWatchlist = false;
        this.animeRemoved.emit(this.anime.id);

        const alert = await this.alertCtrl.create({
          message: "Removed from the Watchlist!",
          cssClass: 'custom-alert'
        });
        await alert.present();

        setTimeout(() => {
          alert.dismiss();
        }, 1000);
      });
    } else {
      this.watchlistService.addToWatchlist(this.anime).subscribe(async () => {
        this.isInWatchlist = true;

        const alert = await this.alertCtrl.create({
          message: "Added to the Watchlist!",
          cssClass: 'custom-alert'
        });
        await alert.present();

        setTimeout(() => {
          alert.dismiss();
        }, 1000);
      });
    }
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
