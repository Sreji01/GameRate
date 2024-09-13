import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Game } from "../game.model";

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private dbUrl = 'https://anime-app-1efe0-default-rtdb.europe-west1.firebasedatabase.app/users';
  games!: Game[];

  constructor(private authService: AuthService, private http: HttpClient) { }

  addToPlaylist(game: Game): Observable<void> {
    return this.authService.userId.pipe(
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not authenticated');
        }
        const userPlaylistUrl = `${this.dbUrl}/${userId}/playlist/${game.id}.json`;

        return this.http.put<void>(userPlaylistUrl,
          { id: game.id, title: game.title, year: game.year, imageUrl: game.imageUrl, posterUrl: game.posterUrl, description: game.description });
      })
    );
  }

  removeFromPlaylist(gameId: string): Observable<void> {
    return this.authService.userId.pipe(
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not authenticated');
        }
        const userPlaylistUrl = `${this.dbUrl}/${userId}/playlist/${gameId}.json`;
        return this.http.delete<void>(userPlaylistUrl);
      })
    );
  }

  getGamesFromPlaylist(userId: string): Observable<Game[]> {
    const userPlaylistUrl = `${this.dbUrl}/${userId}/playlist.json`;
    return this.http.get<{ [key: string]: Game }>(userPlaylistUrl).pipe(
      map(gamesData => {
        const games: Game[] = [];
        for (const key in gamesData) {
          if (gamesData.hasOwnProperty(key)) {
            games.push({
              id: key,
              title: gamesData[key].title,
              year: gamesData[key].year,
              imageUrl: gamesData[key].imageUrl,
              posterUrl: gamesData[key].posterUrl,
              description: gamesData[key].description,
              rating: gamesData[key].rating
            });
          }
        }
        return games;
      })
    );
  }

  isGameInPlaylist(gameId: string): Observable<boolean> {
    return this.authService.userId.pipe(
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not authenticated');
        }
        const userPlaylistUrl = `${this.dbUrl}/${userId}/playlist/${gameId}.json`;
        return this.http.get<Game>(userPlaylistUrl).pipe(
          map(anime => !!anime)
        );
      })
    );
  }

}
