import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Anime} from "../anime.model";
import {ActivatedRoute} from "@angular/router";
import {AnimeService} from "../anime.service";
import { Location } from '@angular/common';
import {WatchlistService} from "../watchlist.service";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-anime-details',
  templateUrl: './anime-details.page.html',
  styleUrls: ['./anime-details.page.scss'],
})
export class AnimeDetailsPage implements OnInit {
  anime!: Anime
  starsArray: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  animeRating: number = 0;
  reviewHeadline!: string;
  reviewContent!: string;
  isInWatchlist: boolean = false;
  @Output() animeRemoved = new EventEmitter<string>();

  constructor(
    private route: ActivatedRoute,
    private animeService: AnimeService,
    private location: Location,
    private alertCtrl: AlertController,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const animeId = paramMap.get('id');
      if (animeId !== null) {
        this.anime = this.animeService.getAnime(animeId)!;
      }
    });
  }

  goBack() {
    this.location.back();
  }

  getStarIcon(index: number): string {
    return index < this.animeRating ? 'star' : 'star-outline';
  }

  toggleRating(index: number): void {
    this.animeRating = index + 1;
  }

  async openAlert(event: MouseEvent) {

    if (this.isInWatchlist) {
      this.watchlistService.removeFromWatchlist(this.anime.id).subscribe(async () => {
        this.isInWatchlist = false;
        this.animeRemoved.emit(this.anime.id);

        const alert = await this.alertCtrl.create({
          message: "Removed from the Watchlist!",
          buttons: ['OK'],
          cssClass: 'custom-alert'
        });
        await alert.present();
      });
    } else {
      this.watchlistService.addToWatchlist(this.anime).subscribe(async () => {
        this.isInWatchlist = true;

        const alert = await this.alertCtrl.create({
          message: "Added to the Watchlist!",
          buttons: ['OK'],
          cssClass: 'custom-alert'
        });
        await alert.present();
      });
    }
  }
  protected readonly event = event;
}
