import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import {Observable, of} from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

export interface ReviewData {
  headline: string;
  content: string;
  rating: number;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private dbUrl = 'https://anime-app-1efe0-default-rtdb.europe-west1.firebasedatabase.app/reviews';

  constructor(private http: HttpClient, private authService: AuthService) {}

  addReview(gameId: string, headline: string, content: string, rating: number): Observable<any> {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User ID not available');
        }
        const reviewUrl = `${this.dbUrl}/${encodeURIComponent(gameId)}/${userId}.json`;
        const reviewsUrl = `${this.dbUrl}/${encodeURIComponent(gameId)}.json`;
        const gameUrl = `https://anime-app-1efe0-default-rtdb.europe-west1.firebasedatabase.app/games/${encodeURIComponent(gameId)}.json`;

        return this.http.get(reviewUrl).pipe(
          switchMap(existingReview => {
            if (existingReview) {
              return of({ message: 'Review already exists' });
            } else {
              const newReview = {
                headline: headline,
                content: content,
                rating: rating
              };
              return this.http.put(reviewUrl, newReview).pipe(
                switchMap(() => {
                  return this.http.get<{ [key: string]: { rating: number } }>(reviewsUrl);
                }),
                switchMap(reviews => {
                  const ratings = Object.values(reviews).map(review => review.rating);
                  const averageRating = ratings.reduce((sum, current) => sum + current, 0) / ratings.length;

                  return this.http.patch(gameUrl, { rating: averageRating });
                })
              );
            }
          })
        );
      })
    );
  }

  editReview(gameId: string, headline: string, content: string, rating: number): Observable<any> {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User ID not available');
        }
        const updatedReview = {
          headline: headline,
          content: content,
          rating: rating
        };

        const reviewUrl = `${this.dbUrl}/${encodeURIComponent(gameId)}/${userId}.json`;
        const reviewsUrl = `${this.dbUrl}/${encodeURIComponent(gameId)}.json`;
        const gameUrl = `https://anime-app-1efe0-default-rtdb.europe-west1.firebasedatabase.app/games/${encodeURIComponent(gameId)}.json`;

        return this.http.put(reviewUrl, updatedReview).pipe(
          switchMap(() => {
            return this.http.get<{ [key: string]: { rating: number } }>(reviewsUrl);
          }),
          switchMap(reviews => {
            const ratings = Object.values(reviews).map(review => review.rating);
            const averageRating = ratings.length > 0
              ? ratings.reduce((sum, current) => sum + current, 0) / ratings.length : 0;

            return this.http.patch(gameUrl, { rating: averageRating });
          })
        );
      })
    );
  }

  deleteReview(gameId: string): Observable<any> {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User ID not available');
        }

        const reviewUrl = `${this.dbUrl}/${encodeURIComponent(gameId)}/${userId}.json`;
        const reviewsUrl = `${this.dbUrl}/${encodeURIComponent(gameId)}.json`;
        const gameUrl = `https://anime-app-1efe0-default-rtdb.europe-west1.firebasedatabase.app/games/${encodeURIComponent(gameId)}.json`;

        return this.http.delete(reviewUrl).pipe(
          switchMap(() => this.http.get<{ [key: string]: { rating: number } } | null>(reviewsUrl)),
          switchMap(reviews => {
            let averageRating = 0;

            if (reviews) {
              const reviewEntries = Object.values(reviews);
              if (reviewEntries.length > 0) {
                const ratings = reviewEntries.map(review => review.rating);
                averageRating = ratings.reduce((sum, current) => sum + current, 0) / ratings.length;
              }
            }

            return this.http.patch(gameUrl, { rating: averageRating });
          })
        );
      })
    );
  }

  getAverageRating(gameId: string): Observable<number> {
    const reviewsUrl = `${this.dbUrl}/${encodeURIComponent(gameId)}.json`;
    return this.http.get<{ [key: string]: { rating: number } }>(reviewsUrl).pipe(
      switchMap(reviews => {
        let averageRating = 0;

        if (reviews) {
          const ratings = Object.values(reviews).map(review => review.rating);
          if (ratings.length > 0) {
            averageRating = ratings.reduce((sum, current) => sum + current, 0) / ratings.length;
          }
        }

        return of(averageRating);
      })
    );
  }

  getReview(gameId: string, userId: string): Observable<ReviewData | null> {
    const url = `${this.dbUrl}/${encodeURIComponent(gameId)}/${userId}.json`;
    return this.http.get<ReviewData | null>(url);
  }
}
