import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, catchError, map, tap, throwError} from "rxjs";
import {User} from "./user.model";
import {Router} from "@angular/router";

interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  localId: string,
  expiresIn: string,
  registered?: string
}

interface UserData {
  name?: string,
  surname?: string,
  username?: string,
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private _isUserAuthenticated = false;
  private _user = new BehaviorSubject<User | null>(null);
  private dbUrl = 'https://anime-app-1efe0-default-rtdb.europe-west1.firebasedatabase.app/users';
  isLoading = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) { }

  get isUserAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) =>{
        if(user) {
          return !!user.token;
        }else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) =>{
        if(user) {
          return user.id;
        }else {
          return null;
        }
      })
    );
  }

  register(user: UserData) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
      { email: user.email, password: user.password, returnSecureToken: true }
    ).pipe(
      tap((userData) => {
        const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
        const newUser = new User(userData.localId, userData.email, userData.idToken, expirationTime);
        this._user.next(newUser);
        this._isUserAuthenticated = true;

        this.saveUserData(userData.localId, user);
      })
    );
  }

  private saveUserData(userId: string, user: UserData) {
    return this.http.put(`${this.dbUrl}/${userId}.json`, {
      email: user.email,
      username: user.username,
      name: user.name,
      surname: user.surname,
      password: user.password
    }).subscribe({
      error: (error) => {
        console.error('Error saving user data:', error);
      }
    });
  }

  logIn(user: { email: string, password: string }) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
      { email: user.email, password: user.password, returnSecureToken: true }
    ).pipe(
      tap((userData) => {
        const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
        const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
        this._isUserAuthenticated = true;
        this._user.next(user);
      }),
      catchError(errorRes => {
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email address could not be found.';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'This password is not correct.';
            break;
          case 'USER_DISABLED':
            errorMessage = 'This user has been disabled.';
            break;
        }
        return throwError(errorMessage);
      })
    );
  }

}
