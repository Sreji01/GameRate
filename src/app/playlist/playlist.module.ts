import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WatchlistPageRoutingModule } from './playlist-routing.module';

import { PlaylistPage } from './playlist.page';
import {SharedModule} from "../../shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WatchlistPageRoutingModule,
    SharedModule
  ],
  declarations: [PlaylistPage]
})
export class WatchlistPageModule {}
