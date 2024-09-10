import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimeDetailsPageRoutingModule } from './game-details-routing.module';

import { GameDetailsPage } from './game-details.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AnimeDetailsPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [GameDetailsPage]
})
export class AnimeDetailsPageModule {}
