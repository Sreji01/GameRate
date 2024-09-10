import { Component, OnInit } from '@angular/core';
import { Game } from "../game.model";
import { WatchlistService } from "../services/watchlist.service";
import { switchMap, take } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.page.html',
  styleUrls: ['./watchlist.page.scss'],
})
export class WatchlistPage implements OnInit {
  games: Game[] = [];
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
      next: (games) => {
        this.games = games;
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }

  onAnimeRemoved(gameId: string) {
    this.games = this.games.filter(game => game.id !== gameId);
  }
}
