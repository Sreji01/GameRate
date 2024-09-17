import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Game } from '../game.model';

@Component({
  selector: 'app-game-modal',
  templateUrl: './game-modal.component.html',
  styleUrls: ['./game-modal.component.scss'],
})
export class GameModalComponent implements OnInit {
  gameForm!: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private gameService: GameService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
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

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Success',
      message: 'Game added successfully!',
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

    this.gameService.addGame(newGame).subscribe(() => {
      this.presentAlert().then(() => {
        this.resetForm();
      });
    });
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
