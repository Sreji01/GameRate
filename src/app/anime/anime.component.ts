import {Component, Input, OnInit} from '@angular/core';
import {Anime} from "../anime.model";

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.scss'],
})
export class AnimeComponent  implements OnInit {

  @Input() anime!: Anime
  constructor() { }

  ngOnInit() {}

}
