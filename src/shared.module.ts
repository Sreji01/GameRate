import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {AnimeComponent} from "./app/anime/anime.component";

@NgModule({
  declarations: [
    AnimeComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    AnimeComponent
  ]
})
export class SharedModule { }
