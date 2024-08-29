import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, catchError, map, tap, throwError} from "rxjs";
import {User} from "../auth/user.model";
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
        let errorMessage = '';
        return throwError(errorMessage);
      })
    );
  }

  getUserData(userId: string) {
    return this.http.get<UserData>(`${this.dbUrl}/${userId}.json`).pipe(
      map(data => {
        if (data) {
          return {
            email: data.email,
            username: data.username,
            name: data.name,
            surname: data.surname,
            password: data.password
          };
        } else {
          throw new Error('User data not found');
        }
      }),
      catchError(error => {
        console.error('Error fetching user data:', error);
        return throwError('Failed to fetch user data');
      })
    );
  }

  logOut() {
    this.isLoading.next(true);
    setTimeout(() => {
      this._user.next(null);
      this.isLoading.next(false);
      this.router.navigateByUrl('/log-in');
    }, 1000);
  }

  logOutPopover(){
    setTimeout(() => {
      this._user.next(null);
      this.router.navigateByUrl('/log-in');
    }, 1000);
  }
}
