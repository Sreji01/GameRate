import { Component, OnInit } from '@angular/core';
import {Anime} from "../anime.model";
import {AnimeService} from "../anime.service";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {

  animes!: Anime[];
  constructor(private animeService: AnimeService) { }

  ngOnInit() {
    this.animeService.getAnimes().subscribe((animes) =>{
      console.log(animes);
      this.animes = animes;
    });
  }



}
