// Decorators
import { Injectable } from '@angular/core';

// RXJS
import { BehaviorSubject, Observable } from 'rxjs';

// HTTP
import { HttpClient } from '@angular/common/http';

// Models
import { ServerResponse } from '../models/server-response';
import { Cart } from '../models/cart';
import { Book } from '../models/book';

const domain = 'http://localhost:3000';
const getCartEndPoint =  domain + "/api/v1/carts/"
const getCartSizeEndpoint = domain + '/api/v1/carts/getSize';
const addToCartEndpoint = domain + '/api/v1/carts/add-to-cart/';
const removeFromCartEndpoint = domain + '/api/v1/carts/remove-from-cart/';
const checkoutEndpoint = domain + '/api/v1/carts/checkout';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _books: Book[] = [];
  books: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);

  constructor(private http: HttpClient) { }

  getCartSize(): Observable<ServerResponse<number>> {
    return this.http.get<ServerResponse<number>>(getCartSizeEndpoint);
  }

  getCart(): Observable<ServerResponse<Cart>> {
    return this.http.get<ServerResponse<Cart>>(getCartEndPoint);
  }

  addToCart(book: Book): Observable<ServerResponse<Cart>> {
    this._books.push(book);
    this.books.next(this._books);
    return this.http.post<ServerResponse<Cart>>(addToCartEndpoint + book._id, {});
  }

  removeFromCart(id: string): Observable<ServerResponse<Cart>> {
    return this.http.delete<ServerResponse<Cart>>(removeFromCartEndpoint + id);
  }

  checkout(payload: object): Observable<ServerResponse<object>> {
    return this.http.post<ServerResponse<object>>(checkoutEndpoint, payload);
  }
}