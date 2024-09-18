import { Injectable } from '@angular/core';
import {Game} from "../game.model";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class GameService {

  games: Game[] = [];
  dbUrl: string = "https://anime-app-1efe0-default-rtdb.europe-west1.firebasedatabase.app/games";

  constructor(private http: HttpClient) { }

  addGame(game: Game) {
    return this.http.post<{ name: string }>(`${this.dbUrl}.json`, game);
  }

  getGame(gameId: string): Observable<Game> {
    return this.http.get<Game>(`${this.dbUrl}/${gameId}.json`);
  }

  editGame(gameId: string, updatedGame: Game) {
    return this.http.put(`${this.dbUrl}/${gameId}.json`, updatedGame);
  }

  deleteGame(gameId: string) {
    return this.http.delete(`${this.dbUrl}/${gameId}.json`);
  }

  getGameLocal(id: string) {
    return this.games.find((g) => g.id === id);
  }

  getGames() {
    return this.http.get<{[key: string]: Game }>(`${this.dbUrl}.json`)
      .pipe(map((gamesData) => {
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
        this.games = games;
        return games;
      }));
  }
}



