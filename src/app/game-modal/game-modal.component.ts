import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-game-modal',
  templateUrl: './game-modal.component.html',
  styleUrls: ['./game-modal.component.scss'],
})
export class GameModalComponent implements OnInit {
  gameForm!: FormGroup;

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) {}

  ngOnInit() {
    this.gameForm = this.fb.group({
      title: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1950)]],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      posterUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      description: ['', Validators.required],
    });
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  submitGame() {

  }
}
