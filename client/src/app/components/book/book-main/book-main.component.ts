
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';
import { HelperService } from 'src/app/core/services/helper.service';
import { Book } from '../../../core/models/book';
import { BookService } from '../../../core/services/book.service';

@Component({
  selector: 'app-book-main',
  templateUrl: './book-main.component.html',
  styleUrls: ['./book-main.component.css'],
})
export class BookMainComponent implements OnInit {

  p: number = 1;
  books: Book[] = [];
  selectedBook: Book | undefined;
  booksCount?: Number;
  searchTermTitle: string = '';
  searchTermEmphasis: string = '';
  searchTermIsbn: string = '';
  searchTermType: string = '';
  searchTermAvailable: number = 1000;
  searchTermPrice: number = 50;
  message: string = "";

  constructor(
    public bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private helpService: HelperService
  ) {}

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    this.books = [];
    this.bookService.getAllBooks(this.searchTermTitle, this.searchTermIsbn, this.searchTermType, this.searchTermPrice, this.searchTermAvailable, this.searchTermEmphasis).subscribe((res) => {
      this.booksCount = res.data?.length;
      res.data?.forEach(book => {
        this.books.push(book);
      });
    });
  }

  addToCart(book: Book) {
    this.cartService.addToCart(book).subscribe((res) => {
      this.selectedBook = book;
      this.message = res.message;
    })
  }

  isLoggedIn() {
    return this.helpService.isLoggedIn();
  }
}
