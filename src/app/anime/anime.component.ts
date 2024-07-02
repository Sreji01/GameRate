import {Component, Input, OnInit} from '@angular/core';
import {Anime} from "../anime.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.scss'],
})
export class AnimeComponent  implements OnInit {

  @Input() anime!: Anime
  constructor(private router: Router) { }

  ngOnInit() {}

  navigateToDetails(animeId: string, event: MouseEvent) {
    const currentUrl = this.router.url;
    const baseUrl = currentUrl.split('/')[1];
    this.router.navigateByUrl(`/${baseUrl}/anime-details/${animeId}`);
  }

}
