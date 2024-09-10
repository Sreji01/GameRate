import { Injectable } from '@angular/core';
import {Game} from "../game.model";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class GameService {

  games: Game[] = [];
  dbUrl: string = "https://anime-app-1efe0-default-rtdb.europe-west1.firebasedatabase.app/animes.json"
  constructor(private http: HttpClient) { }

  getGame(id: string) {
    return this.games.find((g) => g.id === id)
  }

  getGames(){
    return this.http.get<{[key: string]: Game }>(this.dbUrl).
    pipe(map( (gamesData) => {
      const games: Game[] = [];

      for (const key in gamesData){
        if (gamesData.hasOwnProperty(key)){
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


