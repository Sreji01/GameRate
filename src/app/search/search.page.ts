import { Component, OnInit } from '@angular/core';
import { Anime } from '../anime.model';
import { AnimeService } from '../services/anime.service';
import {Router} from "@angular/router";
import {ReviewService} from "../services/review.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  animes: Anime[] = [];
  filteredAnimes: Anime[] = [];
  searchTerm: string = '';

  constructor(private animeService: AnimeService, private router: Router, private reviewService: ReviewService) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.loadAnimes();
  }

  loadAnimes() {
    this.animeService.getAnimes().subscribe(animes => {
      this.animes = animes;
      this.filteredAnimes = animes;
    });
  }

  filterAnimes() {
    const term = this.searchTerm.toLowerCase();
    this.filteredAnimes = this.animes.filter(anime => anime.title.toLowerCase().includes(term));
  }

  navigateToDetails(animeId: string, event: MouseEvent) {
    const currentUrl = this.router.url;
    const baseUrl = currentUrl.split('/')[1];
    this.router.navigateByUrl(`/${baseUrl}/anime-details/${animeId}`);
  }


}
