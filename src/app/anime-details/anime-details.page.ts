import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Anime } from '../anime.model';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../anime.service';
import { Location } from '@angular/common';
import { ReviewService } from '../review.service';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ReviewData } from "../review.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertController } from "@ionic/angular";
import {WatchlistService} from "../watchlist.service";

@Component({
  selector: 'app-anime-details',
  templateUrl: './anime-details.page.html',
  styleUrls: ['./anime-details.page.scss'],
})
export class AnimeDetailsPage implements OnInit {
  anime!: Anime;
  starsArray: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  animeRating: number = 0;
  originalRating: number = 0;
  originalHeadline: string = '';
  originalContent: string = '';
  review!: ReviewData | null;
  showSubmitButton: boolean = true;
  showEditButton: boolean = false;
  showEditIcon: boolean = false;
  showCancelIcon: boolean = false;
  showDeleteIcon: boolean = false;
  reviewForm!: FormGroup;
  disableHeadlineInput: boolean = false;
  disableContentInput: boolean = false;
  isInWatchlist: boolean = false;
  @Output() animeRemoved = new EventEmitter<string>();


  constructor(
    private route: ActivatedRoute,
    private animeService: AnimeService,
    private location: Location,
    private reviewService: ReviewService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(paramMap => {
        const animeId = paramMap.get('id');
        if (animeId !== null) {
          this.anime = this.animeService.getAnime(animeId)!;
          return this.authService.userId.pipe(
            switchMap(userId => {
              return this.reviewService.getReview(animeId, userId!);
            })
          );
        } else {
          return new Observable<null>();
        }
      })
    ).subscribe(review => {
      this.review = review;
      this.initializeForm();
      if (review) {
        this.reviewForm.patchValue({
          reviewHeadline: review.headline,
          reviewContent: review.content
        });
        this.animeRating = +review.rating + 1;
        this.originalRating = this.animeRating;
        this.originalHeadline = review.headline;
        this.originalContent = review.content;
        this.showEditIcon = true;
        this.showDeleteIcon = true;
        this.showSubmitButton = false;
        this.disableHeadlineInput = true;
        this.disableContentInput = true;
      }
      this.checkWatchlistStatus();
    });

    this.initializeForm();
  }

  async checkWatchlistStatus() {
    this.watchlistService.isAnimeInWatchlist(this.anime.id).subscribe(isInWatchlist => {
      this.isInWatchlist = isInWatchlist;
    });
  }

  initializeForm() {
    this.reviewForm = new FormGroup({
      reviewHeadline: new FormControl(null),
      reviewContent: new FormControl(null)
    });
  }

  goBack() {
    this.location.back();
  }

  getStarIcon(index: number): string {
    return index < this.animeRating ? 'star' : 'star-outline';
  }

  toggleRating(index: number): void {
    if (!this.disableContentInput) {
      this.animeRating = index + 1;
    }
  }

  get isFormValid(): boolean {
    return this.reviewForm.valid && this.animeRating > 0;
  }

  submitReview(): void {
    if (this.reviewForm.valid && this.animeRating > 0 && this.showSubmitButton) {
      this.addReview();
    }
    if (this.reviewForm.valid && this.animeRating > 0 && this.showEditButton) {
      this.editReview();
    }
  }

  addReview() {
    const review = {
      headline: this.reviewForm.get('reviewHeadline')?.value,
      content: this.reviewForm.get('reviewContent')?.value,
      rating: this.animeRating - 1
    };

    this.reviewService.addReview(this.anime.id, review.headline, review.content, review.rating)
      .subscribe({
        next: (response) => {
          console.log('Review added successfully', response);
          this.showEditIcon = true;
          this.showSubmitButton = false;
          this.showDeleteIcon = true;
          this.disableHeadlineInput = true;
          this.disableContentInput = true;
          this.openAddAlert();
          this.updateAnimeRating();
        },
        error: (error) => {
          console.error('Error adding review:', error);
        }
      });
  }

  updateAnimeRating() {
    this.reviewService.getAverageRating(this.anime.id).subscribe({
      next: (averageRating) => {
        this.anime.rating = averageRating;
      },
      error: (error) => {
        console.error('Error fetching updated rating:', error);
      }
    });
  }

  editReview() {
    const review = {
      headline: this.reviewForm.get('reviewHeadline')?.value,
      content: this.reviewForm.get('reviewContent')?.value,
      rating: this.animeRating - 1
    };

    this.reviewService.editReview(this.anime.id, review.headline, review.content, review.rating)
      .subscribe({
        next: (response) => {
          console.log('Review updated successfully', response);
          this.showEditIcon = true;
          this.showEditButton = false;
          this.showCancelIcon = false;
          this.showDeleteIcon = true;
          this.disableHeadlineInput = true;
          this.disableContentInput = true;
          this.openEditAlert();
          this.updateAnimeRating();
        },
        error: (error) => {
          console.error('Error editing review:', error);
        }
      });
  }

  deleteReview() {
    this.reviewService.deleteReview(this.anime.id).subscribe({
      next: (response) => {
        console.log('Review deleted successfully', response);
        this.showEditIcon = false;
        this.showEditButton = false;
        this.showCancelIcon = false;
        this.showSubmitButton = true;
        this.showDeleteIcon = false;
        this.disableHeadlineInput = false;
        this.disableContentInput = false;
        this.reviewForm.reset();
        this.animeRating = 0;
        this.openDeleteAlert();
        this.updateAnimeRating();
      },
      error: (error) => {
        console.error('Error deleting review:', error);
      }
    });
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

  openEditAlert() {
    this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Review updated successfully!',
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

  openDeleteAlert() {
    this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Review deleted successfully!',
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

  onEdit() {
    this.disableContentInput = false;
    this.disableHeadlineInput = false;
    this.showSubmitButton = false;
    this.showEditButton = true
    this.showEditIcon = false;
    this.showCancelIcon = true;
    this.showDeleteIcon = false;
    this.originalRating = this.animeRating;
    this.originalHeadline = this.reviewForm.get('reviewHeadline')?.value;
    this.originalContent = this.reviewForm.get('reviewContent')?.value;
  }

  openDeleteQuestion() {
    this.alertCtrl.create({
      message: "Are you sure you want to delete this review?",
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteReview();
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('User clicked No');
          }
        }
      ],
      cssClass: 'custom-alert'
    }).then(alertEl => {
      alertEl.present();
    });
  }

  onCancel() {
    this.disableContentInput = true;
    this.disableHeadlineInput = true;
    this.showSubmitButton = false;
    this.showEditButton = false;
    this.showEditIcon = true;
    this.showCancelIcon = false;
    this.showDeleteIcon = true;
    this.animeRating = this.originalRating;
    this.reviewForm.patchValue({
      reviewHeadline: this.originalHeadline,
      reviewContent: this.originalContent
    });
  }

  async openAlert(event: MouseEvent) {

    if (this.isInWatchlist) {
      this.watchlistService.removeFromWatchlist(this.anime.id).subscribe(async () => {
        this.isInWatchlist = false;
        this.animeRemoved.emit(this.anime.id);

        const alert = await this.alertCtrl.create({
          message: "Removed from the Watchlist!",
          buttons: ['OK'],
          cssClass: 'custom-alert'
        });
        await alert.present();
      });
    } else {
      this.watchlistService.addToWatchlist(this.anime).subscribe(async () => {
        this.isInWatchlist = true;

        const alert = await this.alertCtrl.create({
          message: "Added to the Watchlist!",
          buttons: ['OK'],
          cssClass: 'custom-alert'
        });
        await alert.present();
      });
    }
  }

  protected readonly event = event;
}
