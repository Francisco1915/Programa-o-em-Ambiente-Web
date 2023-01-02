import { Injectable } from '@angular/core';

// RXJS
import { Observable } from 'rxjs';

// HTTP
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Models
import { ServerResponse } from '../models/server-response';
import { User } from '../models/user';
import { Receipt } from '../models/receipt';
import { Request } from '../models/request';

const domain = 'http://localhost:3000';
const getUserEndpoint = domain + '/api/v1/users/profile';
const registerUserEndpoint = domain + '/api/v1/users/register';
const loginUserEndpoint = domain + '/api/v1/users/login';
const editUserEndpoint = domain + '/api/v1/users/edit/';
const getPurchaseHistoryEndpoint = domain + '/api/v1/users/purchaseHistory';
const getallRequests = domain + '/api/v1/books/requests';
const deleteRequestEndpoint = domain + '/api/v1/books/requests/delete/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ServerResponse<User>> {
    return this.http.get<ServerResponse<User>>(getUserEndpoint, httpOptions);
  }
  
  getPurchaseHistory(): Observable<ServerResponse<Receipt[]>> {
    return this.http.get<ServerResponse<Receipt[]>>(getPurchaseHistoryEndpoint);
  }

  register(payload: User): Observable<ServerResponse<User>> {
    return this.http.post<ServerResponse<User>>(registerUserEndpoint, payload, httpOptions);
  }

  edit(payload: User): Observable<ServerResponse<User>> {
    return this.http.post<ServerResponse<User>>(editUserEndpoint, payload, httpOptions);
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  login(email: string, password: string): Observable<ServerResponse<User>> {
    return this.http.post<ServerResponse<User>>(loginUserEndpoint, JSON.stringify({ email, password }), httpOptions);
  }

  getRequests(): Observable<ServerResponse<Request[]>> {
    return this.http.get<ServerResponse<Request[]>>(getallRequests);
  }

  deleteRequest(id: string): Observable<ServerResponse<Request>> {
    return this.http.delete<ServerResponse<Request>>(deleteRequestEndpoint + id)
  }

}
