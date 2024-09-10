import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Game } from "../game.model";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { WatchlistService } from "../services/watchlist.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @Input() game!: Game;
  @Output() gameRemoved = new EventEmitter<string>();
  isInWatchlist: boolean = false;

  constructor(private router: Router, private alertCtrl: AlertController, private watchlistService: WatchlistService) { }

  ngOnInit() {
    this.checkWatchlistStatus();
  }

  checkWatchlistStatus() {
    this.watchlistService.isAnimeInWatchlist(this.game.id).subscribe(isInWatchlist => {
      this.isInWatchlist = isInWatchlist;
    });
  }

  async openAlert(event: MouseEvent) {
    event.preventDefault();

    if (this.isInWatchlist) {
      this.watchlistService.removeFromWatchlist(this.game.id).subscribe(async () => {
        this.isInWatchlist = false;
        this.gameRemoved.emit(this.game.id);

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
      this.watchlistService.addToWatchlist(this.game).subscribe(async () => {
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
    this.router.navigateByUrl(`/${baseUrl}/game-details/${animeId}`);
  }
}
