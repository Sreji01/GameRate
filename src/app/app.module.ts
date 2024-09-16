import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {HeaderComponent} from "./header/header.component";
import {ReviewModalComponent} from "./review-modal/review-modal.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserPopoverComponent} from "./user-popover/user-popover.component";
import {GameModalComponent} from "./game-modal/game-modal.component";

@NgModule({
  declarations: [AppComponent, HeaderComponent, ReviewModalComponent, UserPopoverComponent, GameModalComponent] ,
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
