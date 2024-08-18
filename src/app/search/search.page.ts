import { Component, OnInit } from '@angular/core';
import { Anime } from '../anime.model';
import { AnimeService } from '../anime.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  animes: Anime[] = [];
  filteredAnimes: Anime[] = [];
  searchTerm: string = '';

  constructor(private animeService: AnimeService, private router: Router,) { }

  ngOnInit() {
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
