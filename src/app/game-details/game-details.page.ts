import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Game } from '../game.model';
import {ActivatedRoute, Router} from '@angular/router';
import { GameService } from '../services/game.service';
import { Location } from '@angular/common';
import { ReviewService } from '../services/review.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ReviewData } from "../services/review.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {AlertController, ModalController} from "@ionic/angular";
import { PlaylistService } from "../services/playlist.service";
import {GameModalComponent} from "../game-modal/game-modal.component";

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.page.html',
  styleUrls: ['./game-details.page.scss'],
})
export class GameDetailsPage implements OnInit {
  game!: Game;
  starsArray: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  gameRating: number = 0;
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
  isInPlaylist: boolean = false;
  @Output() gameRemoved = new EventEmitter<string>();
  role: string = ''
  modalIsOpen: boolean = false
  deleteType: string = ''


  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private location: Location,
    private reviewService: ReviewService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private playlistService: PlaylistService,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(paramMap => {
        const gameId = paramMap.get('id');
        if (gameId !== null) {
          this.game = this.gameService.getGameLocal(gameId)!;
          return this.authService.userId.pipe(
            switchMap(userId => {
              return this.reviewService.getReview(gameId, userId!);
            })
          );
        } else {
          return new Observable<null>();
        }
      })
    ).subscribe(review => {
      this.review = review;
      if (review) {
        this.reviewForm.patchValue({
          reviewHeadline: review.headline,
          reviewContent: review.content
        });
        this.gameRating = +review.rating + 1;
        this.originalRating = this.gameRating;
        this.originalHeadline = review.headline;
        this.originalContent = review.content;
        this.showEditIcon = true;
        this.showDeleteIcon = true;
        this.showSubmitButton = false;
        this.disableHeadlineInput = true;
        this.disableContentInput = true;
      }
      this.checkPlaylistStatus();
    });

    this.initializeForm();

    this.authService.userId.subscribe(userId => {
      if (userId) {
        this.authService.getUserData(userId).subscribe(
          userData => {
            this.role = userData.role || '';
          },
          error => {
            console.error('Failed to fetch user data:', error);
          }
        );
      }
    });
  }

  checkPlaylistStatus() {
    this.playlistService.isGameInPlaylist(this.game.id).subscribe(isInPlaylist => {
      this.isInPlaylist = isInPlaylist;
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
    return index < this.gameRating ? 'star' : 'star-outline';
  }

  toggleRating(index: number): void {
    if (!this.disableContentInput) {
      this.gameRating = index + 1;
    }
  }

  get isFormValid(): boolean {
    return this.reviewForm.valid && this.gameRating > 0;
  }

  submitReview(): void {
    if (this.reviewForm.valid && this.gameRating > 0 && this.showSubmitButton) {
      this.addReview();
    }
    if (this.reviewForm.valid && this.gameRating > 0 && this.showEditButton) {
      this.editReview();
    }
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
        }
      ],
      cssClass: 'custom-alert'
    }).then(alertEl => {
      alertEl.present();
    });
  }

  addReview() {
    const review = {
      headline: this.reviewForm.get('reviewHeadline')?.value,
      content: this.reviewForm.get('reviewContent')?.value,
      rating: this.gameRating - 1
    };

    this.reviewService.addReview(this.game.id, review.headline, review.content, review.rating)
      .subscribe({
        next: (response) => {
          console.log('Review added successfully', response);
          this.showEditIcon = true;
          this.showSubmitButton = false;
          this.showDeleteIcon = true;
          this.disableHeadlineInput = true;
          this.disableContentInput = true;
          this.openAddAlert();
          this.updateGameRating();
        },
        error: (error) => {
          console.error('Error adding review:', error);
        }
      });
  }

  editReview() {
    const review = {
      headline: this.reviewForm.get('reviewHeadline')?.value,
      content: this.reviewForm.get('reviewContent')?.value,
      rating: this.gameRating - 1
    };

    this.reviewService.editReview(this.game.id, review.headline, review.content, review.rating)
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
          this.updateGameRating();
        },
        error: (error) => {
          console.error('Error editing review:', error);
        }
      });
  }

  deleteReview() {
    this.reviewService.deleteReview(this.game.id).subscribe({
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
        this.gameRating = 0;
        this.openDeleteAlert();
        this.updateGameRating();
      },
      error: (error) => {
        console.error('Error deleting review:', error);
      }
    });
  }

  updateGameRating() {
    this.reviewService.getAverageRating(this.game.id).subscribe({
      next: (averageRating) => {
        this.game.rating = averageRating;
      },
      error: (error) => {
        console.error('Error fetching updated rating:', error);
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
    this.originalRating = this.gameRating;
    this.originalHeadline = this.reviewForm.get('reviewHeadline')?.value;
    this.originalContent = this.reviewForm.get('reviewContent')?.value;
  }

  onCancel() {
    this.disableContentInput = true;
    this.disableHeadlineInput = true;
    this.showSubmitButton = false;
    this.showEditButton = false;
    this.showEditIcon = true;
    this.showCancelIcon = false;
    this.showDeleteIcon = true;
    this.gameRating = this.originalRating;
    this.reviewForm.patchValue({
      reviewHeadline: this.originalHeadline,
      reviewContent: this.originalContent
    });
  }

  async openAlert(event: MouseEvent) {

    if (this.isInPlaylist) {
      this.playlistService.removeFromPlaylist(this.game.id).subscribe(async () => {
        this.isInPlaylist = false;
        this.gameRemoved.emit(this.game.id);

        const alert = await this.alertCtrl.create({
          message: "Removed from the Playlist!",
          buttons: ['OK'],
          cssClass: 'custom-alert'
        });
        await alert.present();
      });
    } else {
      this.playlistService.addToPlaylist(this.game).subscribe(async () => {
        this.isInPlaylist = true;

        const alert = await this.alertCtrl.create({
          message: "Added to the Playlist!",
          buttons: ['OK'],
          cssClass: 'custom-alert'
        });
        await alert.present();
      });
    }
  }

  onEditGame(){
    this.modalIsOpen = true;
    this.modalCtrl.create({
      component: GameModalComponent,
      cssClass: 'custom-modal',
      backdropDismiss: true,
      showBackdrop: false,
      componentProps: {
        type: 'edit',
        gameId: this.game.id
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then(() => {
        this.modalIsOpen = false;
      });
    });
  }

  openDeleteGameQuestion() {
    this.alertCtrl.create({
      message: "Are you sure you want to delete this game?",
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteGame(this.game.id);
          }
        },
        {
          text: 'No',
          role: 'cancel',
        }
      ],
      cssClass: 'custom-alert'
    }).then(alertEl => {
      alertEl.present();
    });
  }
  deleteGame(gameId: string) {
    this.gameService.deleteGame(gameId).subscribe(
      () => {
        this.deleteType = 'game';
        this.presentDeleteAlert().then(() => {
          this.refresh();
        });
      },
      (error) => {
        console.error('Failed to delete game:', error);
      }
    );
  }

  refresh() {
    const currentUrl = this.router.url;
    const baseUrl = currentUrl.split('/',2)[1]
    this.router.navigateByUrl(`/${baseUrl}`);
  }

  async presentDeleteAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Success',
      message: 'Game deleted successfully!',
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }

}
