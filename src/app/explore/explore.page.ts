import { Component, OnInit } from '@angular/core';
import {Anime} from "../anime.model";
import {AnimeService} from "../anime.service";
import {InfiniteScrollCustomEvent} from "@ionic/angular";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {

  animes!: Anime[];
  constructor(private animeService: AnimeService) {}

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.animeService.getAnimes().subscribe((animes) =>{
      this.animes = animes;
    });
  }
}
