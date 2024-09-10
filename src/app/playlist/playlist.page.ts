import { Component, OnInit } from '@angular/core';
import { Game } from "../game.model";
import { PlaylistService } from "../services/playlist.service";
import { switchMap, take } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
})
export class PlaylistPage implements OnInit {
  games: Game[] = [];
  error: string | null = null;

  constructor(private playlistService: PlaylistService, private authService: AuthService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User ID not available');
        }
        return this.playlistService.getGamesFromPlaylist(userId);
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

  onGameRemoved(gameId: string) {
    this.games = this.games.filter(game => game.id !== gameId);
  }
}
