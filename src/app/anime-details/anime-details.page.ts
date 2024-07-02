import { Component, OnInit } from '@angular/core';
import {Anime} from "../anime.model";
import {ActivatedRoute} from "@angular/router";
import {AnimeService} from "../anime.service";
import { Location } from '@angular/common';

@Component({
  selector: 'app-anime-details',
  templateUrl: './anime-details.page.html',
  styleUrls: ['./anime-details.page.scss'],
})
export class AnimeDetailsPage implements OnInit {
  anime!: Anime
  starsArray: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  animeRating: number;
  constructor(private route: ActivatedRoute, private animeService: AnimeService, private location: Location) {
    this.animeRating = 0;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const animeId = paramMap.get('id');
      if (animeId !== null) {
        this.anime = this.animeService.getAnime(animeId)!;
      }
    });
  }

  goBack() {
    this.location.back();
  }

  getStarIcon(index: number): string {
    return index < this.animeRating ? 'star' : 'star-outline';
  }

  toggleRating(index: number): void {
    this.animeRating = index + 1;
  }
}
