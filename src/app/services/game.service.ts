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

  getAnime(id: string) {
    return this.games.find((a) => a.id === id)
  }

  getAnimes(){
    return this.http.get<{[key: string]: Game }>(this.dbUrl).
    pipe(map( (animesData) => {
      const animes: Game[] = [];

      for (const key in animesData){
        if (animesData.hasOwnProperty(key)){
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
      this.games = animes;
      return animes;
    }));
  }
}


