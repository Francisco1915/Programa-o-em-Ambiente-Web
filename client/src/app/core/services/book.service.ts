// Decorators
import { Injectable } from '@angular/core';

// RXJS
import { Observable } from 'rxjs';

// HTTP
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Models
import { ServerResponse } from '../models/server-response';
import { Book } from '../models/book';

const domain = 'http://localhost:3000';
const getAllBooksEndpoint = domain + '/api/v1/books';
const getSingleBookEndpoint = domain + '/api/v1/books/';
const editBookEndpoint = domain + '/api/v1/book/edit/';
const deleteBookEndpoint = domain + '/api/v1/book/delete/';
const createrequestEndpoint = domain + '/api/v1/books/create';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root',
})

export class BookService {

  constructor(private http: HttpClient) {}

  getAllBooks(title: string, isbn: string, type: string, price: number, available: number, emphasis: string): Observable<ServerResponse<Book[]>> {
    return this.http.get<ServerResponse<Book[]>>(getAllBooksEndpoint + "?title=" + title + "&isbn=" + isbn + "&type=" + type + "&price=" + price + "&available=" + available + "&emphasis=" + emphasis);
  }

  getSingleBook(id: string): Observable<ServerResponse<Book>> {
    return this.http.get<ServerResponse<Book>>(getSingleBookEndpoint + id);
  }

  editBook(id: string, payload: Book): Observable<ServerResponse<Book>> {
    return this.http.put<ServerResponse<Book>>(editBookEndpoint + id, payload);
  }

  uploadFileWithData(file: File, book: Book): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", book.title);
    formData.append("author", book.author);
    formData.append("isbn", book.isbn);
    formData.append("desc", book.desc);
    formData.append("date", book.date.toString());
    formData.append("price", book.price.toString());
    formData.append("qt", book.qt.toString());
    formData.append("status", "Old");
    formData.append("emphasis", "False");
    formData.append("type", book.type);

    return this.http.post<any>(createrequestEndpoint, formData);
  }

  deleteBook(id: string): Observable<ServerResponse<Book>> {
    return this.http.delete<ServerResponse<Book>>(deleteBookEndpoint + id);
  }

}
