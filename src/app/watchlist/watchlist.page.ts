import { Component, OnInit } from '@angular/core';
import { Anime } from "../anime.model";
import { WatchlistService } from "../watchlist.service";
import { switchMap, take } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.page.html',
  styleUrls: ['./watchlist.page.scss'],
})
export class WatchlistPage implements OnInit {
  animes: Anime[] = [];
  error: string | null = null;

  constructor(private watchlistService: WatchlistService, private authService: AuthService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User ID not available');
        }
        return this.watchlistService.getAnimesFromWatchlist(userId);
      })
    ).subscribe({
      next: (animes) => {
        this.animes = animes;
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }

  onAnimeRemoved(animeId: string) {
    this.animes = this.animes.filter(anime => anime.id !== animeId);
  }
}
