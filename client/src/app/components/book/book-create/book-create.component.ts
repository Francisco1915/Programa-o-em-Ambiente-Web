import { Component, OnInit, Input } from '@angular/core';

// Forms
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';

// Router
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/core/models/book';

// Services
import { BookService } from '../../../core/services/book.service';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css'],
})
export class BookCreateComponent implements OnInit {
  book: Book | undefined;
  message: string = '';
  formBook: FormGroup = new FormGroup({});
  file: File | undefined;

  constructor(
    public bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;

    this.formBook = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      isbn: new FormControl('', [
        Validators.required,
        Validators.pattern(isbnRegex),
      ]),
      author: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
      ]),
      desc: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(150),
      ]),
      price: new FormControl('', [Validators.required, Validators.min(2)]),
      date: new FormControl('', [Validators.required]),
      status: new FormControl('', [
        Validators.required,
        Validators.pattern(/New|Old/),
      ]),
      qt: new FormControl('', [Validators.required, Validators.min(1)]),
      type: new FormControl('', [Validators.required]),
    });
  }

  getFile(event: any) {
    this.file = event.target.files[0];
  }

  addBook(): void {
    
    if (this.file) {
      this.message = '';
      this.bookService
        .uploadFileWithData(this.file, this.formBook.value)
        .subscribe((result) => {
          if (result.data !== undefined) {
            this.router.navigate(['/books']);
          } else {
            this.message = result.message;
            this.router.navigate(['/books']);
          }
        });
    }
  }

  get title() {
    return this.formBook.get('title');
  }

  get author() {
    return this.formBook.get('author');
  }

  get isbn() {
    return this.formBook.get('isbn');
  }

  get desc() {
    return this.formBook.get('desc');
  }

  get date() {
    return this.formBook.get('date');
  }

  get price() {
    return this.formBook.get('price');
  }

  get qt() {
    return this.formBook.get('qt');
  }

  get type() {
    return this.formBook.get('type');
  }

  get status() {
    return this.formBook.get('status');
  }
}
