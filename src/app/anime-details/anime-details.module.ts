import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimeDetailsPageRoutingModule } from './anime-details-routing.module';

import { AnimeDetailsPage } from './anime-details.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AnimeDetailsPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [AnimeDetailsPage]
})
export class AnimeDetailsPageModule {}
