import { Injectable } from '@angular/core';
import { UserInterface } from './userInterface';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { UserRequestsErrors } from '../shared/ErrorHandlers';

const api = environment.apiUrl;
@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: UserInterface;
  isAuthenticated: boolean;
  loggedInUser: UserInterface = null;
  userName: string;
  fetchDetails: any;
  userExists: boolean;

  constructor(private http: HttpClient, private router: Router) { }
  getUser(email: string): Observable<UserInterface> {
    return this.http
      .get<UserInterface>(`${api}api/user/${email}`)
      .pipe(catchError((err) => this.handleHttpError(err)));
  }

  async authenticateUser(email: string, pass: string) {
    await this.getUser(email)
      .toPromise()
      .then((user: UserInterface) => {
        if (user[0].password === pass) {
          this.isAuthenticated = true;
          alert(`Hello ${user[0].firstName} Welcome back`);
          this.loggedInUser = user[0];
        } else {
          return;
        }
      })
      .catch((err: any) => {
        throw new Error(err);
      });
    this.isAuthenticated
      ? this.router.navigate(['/home'])
      : alert(`Sorry password or email you entered is incorect`);
  }
  // TODO: Session storage function (login and after signup + persist details)
  // implement cookies for sychronization across devices

  saveUser(user: UserInterface): Observable<UserInterface> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<UserInterface>(`${api}api/users`, user, options);
  }
  addToFavourites(title) {
    // this.http.patch();
  }
  // Error Handler
  private handleHttpError(err: HttpErrorResponse): Observable<any> {
    const newError = new UserRequestsErrors(100, 'good', 'bad');

    return throwError(newError);
  }
}


