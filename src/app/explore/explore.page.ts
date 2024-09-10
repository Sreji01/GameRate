import { Component, OnInit } from '@angular/core';
import {Game} from "../game.model";
import {GameService} from "../services/game.service";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {

  games!: Game[];
  constructor(private gameService: GameService) {}

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.gameService.getAnimes().subscribe((games) =>{
      this.games = games;
    });
  }
}
