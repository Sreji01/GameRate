import { Component, OnInit } from '@angular/core';
import { Game } from '../game.model';
import { GameService } from '../services/game.service';
import { Router } from "@angular/router";
import { ReviewService } from "../services/review.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  games: Game[] = [];
  filteredGames: Game[] = [];
  searchTerm: string = '';

  constructor(private gameService: GameService, private router: Router, private reviewService: ReviewService) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.loadGames();
  }

  loadGames() {
    this.gameService.getGames().subscribe(games => {
      this.games = games;
      this.filteredGames = games;
    });
  }

  filterGames() {
    const term = this.searchTerm.toLowerCase();
    this.filteredGames = this.games.filter(game => game.title.toLowerCase().includes(term));
  }

  navigateToDetails(gameId: string, event: MouseEvent) {
    const currentUrl = this.router.url;
    const baseUrl = currentUrl.split('/')[1];
    this.router.navigateByUrl(`/${baseUrl}/game-details/${gameId}`);
  }

}
