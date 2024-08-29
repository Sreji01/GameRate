import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertController, ModalController } from "@ionic/angular";
import { Anime } from "../anime.model";
import { AnimeService } from "../services/anime.service";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ReviewService } from "../services/review.service";

@Component({
  selector: 'app-anime-modal',
  templateUrl: './anime-modal.component.html',
  styleUrls: ['./anime-modal.component.scss'],
})
export class AnimeModalComponent implements OnInit {

  animes: Anime[] = [];
  filteredAnimes: Anime[] = [];
  searchTerm: string = '';
  selectedAnime: Anime | null = null;
  reviewForm!: FormGroup;
  starsArray: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  animeRating: number = 0;

  constructor(
    private modalCtrl: ModalController,
    private animeService: AnimeService,
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadAnimes();
  }

  loadAnimes() {
    this.animeService.getAnimes().subscribe(animes => {
      this.animes = animes;
      this.filteredAnimes = animes;
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
    this.filteredAnimes = this.animes.filter(anime => anime.title.toLowerCase().includes(term));
    this.selectedAnime = null;
  }

  selectAnime(anime: Anime) {
    this.selectedAnime = anime;
    this.initForm();
  }

  deselectAnime(event: Event) {
    event.stopPropagation();
    this.selectedAnime = null;
    this.reviewForm.reset();
    this.animeRating = 0;
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  getStarIcon(index: number): string {
    return index < this.animeRating ? 'star' : 'star-outline';
  }

  toggleRating(index: number): void {
    this.animeRating = index + 1;
  }

  get isFormValid(): boolean {
    return this.reviewForm.valid && this.animeRating > 0;
  }

  submitReview() {
    const review = {
      headline: this.reviewForm.get('reviewHeadline')?.value,
      content: this.reviewForm.get('reviewContent')?.value,
      rating: this.animeRating - 1
    };

    if (this.selectedAnime) {
      this.reviewService.addReview(this.selectedAnime.id, review.headline, review.content, review.rating)
        .subscribe({
          next: (response) => {
            if (response.message) {
              this.reviewForm.reset();
              this.animeRating = 0;
              this.openExistAlert();
            } else {
              this.reviewForm.reset();
              this.animeRating = 0;
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
