import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Anime } from "../anime.model";

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private dbUrl = 'https://anime-app-1efe0-default-rtdb.europe-west1.firebasedatabase.app/users';
  animes!: Anime[];

  constructor(private authService: AuthService, private http: HttpClient) { }

  addToWatchlist(anime: Anime): Observable<void> {
    return this.authService.userId.pipe(
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not authenticated');
        }
        const userWatchlistUrl = `${this.dbUrl}/${userId}/watchlist/${anime.id}.json`;

        return this.http.put<void>(userWatchlistUrl,
          { id: anime.id, title: anime.title, year: anime.year, imageUrl: anime.imageUrl, posterUrl: anime.posterUrl, description: anime.description });
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

  getAnimesFromWatchlist(userId: string): Observable<Anime[]> {
    const userWatchlistUrl = `${this.dbUrl}/${userId}/watchlist.json`;
    return this.http.get<{ [key: string]: Anime }>(userWatchlistUrl).pipe(
      map(animesData => {
        const animes: Anime[] = [];
        for (const key in animesData) {
          if (animesData.hasOwnProperty(key)) {
            animes.push({
              id: key,
              title: animesData[key].title,
              year: animesData[key].year,
              imageUrl: animesData[key].imageUrl,
              posterUrl: animesData[key].posterUrl,
              description: animesData[key].description,
              rating: animesData[key].rating
            });
          }
        }
        return animes;
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
        return this.http.get<Anime>(userWatchlistUrl).pipe(
          map(anime => !!anime)
        );
      })
    );
  }

}
