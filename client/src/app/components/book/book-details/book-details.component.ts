import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/core/models/book';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit {
  @Input() book: Book | undefined;
  id: string = '';
  message: string = '';
  isAdd: boolean = false;

  constructor(
    public bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private helperService: HelperService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.isAdd = false;
    this.getBook();
  }

  getBook(): void {
    this.id = this.route.snapshot.params['id'];
    this.bookService.getSingleBook(this.id).subscribe((res) => {
      this.book = res.data;
      this.message = res.message;
    });
  }

  addToCart() {
    if (this.book) {
      this.cartService.addToCart(this.book).subscribe((res) => {
        this.isAdd = true;
        this.message = res.message;
      });
    }
  }
}
