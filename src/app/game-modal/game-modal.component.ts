import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Game } from '../game.model';
import { Router} from "@angular/router";

@Component({
  selector: 'app-game-modal',
  templateUrl: './game-modal.component.html',
  styleUrls: ['./game-modal.component.scss'],
})
export class GameModalComponent implements OnInit {
  gameForm!: FormGroup;
  type: string = '';
  gameId: string = ''

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private gameService: GameService,
    private alertCtrl: AlertController,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.type === 'edit' && this.gameId) {
      this.gameService.getGame(this.gameId).subscribe(
        (game) => {
          console.log(game)
          this.gameForm.patchValue({
            title: game.title,
            year: game.year,
            imageUrl: game.imageUrl,
            posterUrl: game.posterUrl,
            description: game.description
          });
        },
        (error) => {
          console.error('Failed to fetch game data:', error);
        }
      );
    }

    this.gameForm = this.fb.group({
      title: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1950)]],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      posterUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      description: ['', [Validators.required, Validators.minLength(30)]],
    });
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  async presentAddAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Success',
      message: 'Game added successfully!',
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }

  async presentEditAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Success',
      message: 'Game edited successfully!',
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }

  submitGame() {
    if (this.gameForm.invalid) {
      return;
    }

    const newGame: Game = {
      id: '',
      title: this.gameForm.value.title,
      year: this.gameForm.value.year,
      imageUrl: this.gameForm.value.imageUrl,
      posterUrl: this.gameForm.value.posterUrl,
      description: this.gameForm.value.description,
      rating: 0
    };
    if(this.type === 'add'){
      this.gameService.addGame(newGame).subscribe(() => {
        this.presentAddAlert().then(() => {
          this.resetForm();
        });
      });
    }else if(this.type === 'edit'){
      this.gameService.editGame(this.gameId, newGame).subscribe(() => {
        this.modalCtrl.dismiss()
        this.refresh();
        this.presentEditAlert().then(() => {
          this.resetForm();
        });
      });
    }
  }

  refresh() {
    const currentUrl = this.router.url;
    const baseUrl = currentUrl.split('/',2)[1]
    this.router.navigateByUrl(`/${baseUrl}`);
  }

  resetForm() {
    if (this.gameForm) {
      this.gameForm.reset();

      Object.keys(this.gameForm.controls).forEach(key => {
        const control = this.gameForm.get(key);
        if (control) {
          control.markAsUntouched();
          control.markAsPristine();
          control.updateValueAndValidity();
        }
      });
    }
  }
}
