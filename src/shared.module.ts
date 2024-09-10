import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {GameComponent} from "./app/game/game.component";

@NgModule({
  declarations: [
    GameComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    GameComponent
  ]
})
export class SharedModule { }
