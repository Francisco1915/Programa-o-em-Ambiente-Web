// Decorators
import { Injectable } from '@angular/core';

// RXJS
import { Subject } from 'rxjs';

// JWT Decoding
import decode from 'jwt-decode';

// HTTP
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Models
import { ServerResponse } from '../models/server-response';
import { User } from '../models/user';

const domain = 'http://localhost:3000';
const getUserEndpoint = domain + '/api/v1/users/profile/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  isUserLogged = new Subject<boolean>();
  searchQuery = new Subject<string>();
  cartStatus = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  clearSession(): void {
    localStorage.clear();
  }

  getProfile() {
    const decoded: any = decode(this.getToken());
    const id: any = decoded.id;

    return this.http.get<ServerResponse<User>>(getUserEndpoint + id, httpOptions);
  }

  isLoggedIn(): boolean {
    try {
      const decoded: any = decode(this.getToken());

      if (decoded.exp > Date.now() / 1000) {
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  isAdmin(): boolean {
    try {
      const decoded: any = decode(this.getToken());

      if (decoded.exp < Date.now() / 1000 || !(decoded.role == "Admin")) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem('currentUser') || "{}").token;
  }
}

