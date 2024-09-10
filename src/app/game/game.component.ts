import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Game } from "../game.model";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { PlaylistService } from "../services/playlist.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @Input() game!: Game;
  @Output() gameRemoved = new EventEmitter<string>();
  isInPlaylist: boolean = false;

  constructor(private router: Router, private alertCtrl: AlertController, private playlistService: PlaylistService) { }

  ngOnInit() {
    this.checkPlaylistStatus();
  }

  checkPlaylistStatus() {
    this.playlistService.isGameInPlaylist(this.game.id).subscribe(isInPlaylist => {
      this.isInPlaylist = isInPlaylist;
    });
  }

  async openAlert(event: MouseEvent) {
    event.preventDefault();

    if (this.isInPlaylist) {
      this.playlistService.removeFromPlaylist(this.game.id).subscribe(async () => {
        this.isInPlaylist = false;
        this.gameRemoved.emit(this.game.id);

        const alert = await this.alertCtrl.create({
          message: "Removed from the Playlist!",
          cssClass: 'custom-alert'
        });
        await alert.present();

        setTimeout(() => {
          alert.dismiss();
        }, 1000);
      });
    } else {
      this.playlistService.addToPlaylist(this.game).subscribe(async () => {
        this.isInPlaylist = true;

        const alert = await this.alertCtrl.create({
          message: "Added to the Playlist!",
          cssClass: 'custom-alert'
        });
        await alert.present();

        setTimeout(() => {
          alert.dismiss();
        }, 1000);
      });
    }
  }

  navigateToDetails(gameId: string, event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('playlist-icon')) {
      return;
    }

    const currentUrl = this.router.url;
    const baseUrl = currentUrl.split('/')[1];
    this.router.navigateByUrl(`/${baseUrl}/game-details/${gameId}`);
  }
}
