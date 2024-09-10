import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertController, ModalController } from "@ionic/angular";
import { Game } from "../game.model";
import { GameService } from "../services/game.service";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ReviewService } from "../services/review.service";

@Component({
  selector: 'app-game-modal',
  templateUrl: './game-modal.component.html',
  styleUrls: ['./game-modal.component.scss'],
})
export class GameModalComponent implements OnInit {

  games: Game[] = [];
  filteredGames: Game[] = [];
  searchTerm: string = '';
  selectedGame: Game | null = null;
  reviewForm!: FormGroup;
  starsArray: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  gameRating: number = 0;

  constructor(
    private modalCtrl: ModalController,
    private gameService: GameService,
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadAnimes();
  }

  loadAnimes() {
    this.gameService.getAnimes().subscribe(games => {
      this.games = games;
      this.filteredGames = games;
    });
  }

  private initForm() {
    this.reviewForm = new FormGroup({
      reviewHeadline: new FormControl(null),
      reviewContent: new FormControl(null)
    });
  }

  filterAnimes() {
    const term = this.searchTerm.toLowerCase();
    this.filteredGames = this.games.filter(game => game.title.toLowerCase().includes(term));
    this.selectedGame = null;
  }

  selectAnime(game: Game) {
    this.selectedGame = game;
    this.initForm();
  }

  deselectAnime(event: Event) {
    event.stopPropagation();
    this.selectedGame = null;
    this.reviewForm.reset();
    this.gameRating = 0;
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  getStarIcon(index: number): string {
    return index < this.gameRating ? 'star' : 'star-outline';
  }

  toggleRating(index: number): void {
    this.gameRating = index + 1;
  }

  get isFormValid(): boolean {
    return this.reviewForm.valid && this.gameRating > 0;
  }

  submitReview() {
    const review = {
      headline: this.reviewForm.get('reviewHeadline')?.value,
      content: this.reviewForm.get('reviewContent')?.value,
      rating: this.gameRating - 1
    };

    if (this.selectedGame) {
      this.reviewService.addReview(this.selectedGame.id, review.headline, review.content, review.rating)
        .subscribe({
          next: (response) => {
            if (response.message) {
              this.reviewForm.reset();
              this.gameRating = 0;
              this.openExistAlert();
            } else {
              this.reviewForm.reset();
              this.gameRating = 0;
              this.openAddAlert();
            }
          },
          error: (error) => {
            console.error('Error adding review:', error);
          }
        });
    }
  }

  openAddAlert() {
    this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Review added successfully!',
      buttons: [
        {
          text: 'Ok',
        }
      ],
      cssClass: 'custom-alert'
    }).then((alert) => {
      alert.present();
    });
  }

  openExistAlert() {
    this.alertCtrl.create({
      header: 'Error',
      message: 'Review already exists!',
      buttons: [
        {
          text: 'Ok',
        }
      ],
      cssClass: 'custom-alert'
    }).then((alert) => {
      alert.present();
    });
  }
}
