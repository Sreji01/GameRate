import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Game } from "../game.model";

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private dbUrl = 'https://anime-app-1efe0-default-rtdb.europe-west1.firebasedatabase.app/users';
  games!: Game[];

  constructor(private authService: AuthService, private http: HttpClient) { }

  addToWatchlist(game: Game): Observable<void> {
    return this.authService.userId.pipe(
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not authenticated');
        }
        const userWatchlistUrl = `${this.dbUrl}/${userId}/watchlist/${game.id}.json`;

        return this.http.put<void>(userWatchlistUrl,
          { id: game.id, title: game.title, year: game.year, imageUrl: game.imageUrl, posterUrl: game.posterUrl, description: game.description });
      })
    );
  }

  removeFromWatchlist(animeId: string): Observable<void> {
    return this.authService.userId.pipe(
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not authenticated');
        }
        const userWatchlistUrl = `${this.dbUrl}/${userId}/watchlist/${animeId}.json`;
        return this.http.delete<void>(userWatchlistUrl);
      })
    );
  }

  getAnimesFromWatchlist(userId: string): Observable<Game[]> {
    const userWatchlistUrl = `${this.dbUrl}/${userId}/watchlist.json`;
    return this.http.get<{ [key: string]: Game }>(userWatchlistUrl).pipe(
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

  isAnimeInWatchlist(animeId: string): Observable<boolean> {
    return this.authService.userId.pipe(
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not authenticated');
        }
        const userWatchlistUrl = `${this.dbUrl}/${userId}/watchlist/${animeId}.json`;
        return this.http.get<Game>(userWatchlistUrl).pipe(
          map(anime => !!anime)
        );
      })
    );
  }

}
