import { Injectable } from '@angular/core';
import {Anime} from "./anime.model";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  animes: Anime[] = [];
  dbUrl: string = "https://anime-app-1efe0-default-rtdb.europe-west1.firebasedatabase.app/animes.json"
  constructor(private http: HttpClient) { }

  getAnime(id: string) {
    return this.animes.find((a) => a.id === id)
  }

  getAnimes(){
    return this.http.get<{[key: string]: Anime }>(this.dbUrl).
    pipe(map( (animesData) => {
      const animes: Anime[] = [];

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
      this.animes = animes;
      return animes;
    }));
  }
}


