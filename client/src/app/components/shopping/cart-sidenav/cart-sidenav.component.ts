import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { Book } from 'src/app/core/models/book';
import { Cart } from 'src/app/core/models/cart';
import { CartService } from 'src/app/core/services/cart.service';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-cart-sidenav',
  templateUrl: './cart-sidenav.component.html',
  styleUrls: ['./cart-sidenav.component.css'],
})
export class CartSidenavComponent implements OnInit {
  cart: Cart | undefined;
  user: any;
  cartForm: FormGroup = new FormGroup({});
  discont: number = 0;
  changesSub$: Subscription = new Subscription();
  lastCartState: string = '';
  paymentHandler: any = null;
  message: string = '';

  constructor(
    private cartService: CartService,
    private helperService: HelperService,
    private route: Router
  ) {}

  ngOnInit(): void {
/*    this.cartService.books.subscribe((books) => {
      if (this.cart) {
        this.cart.books = books;
      }
    }) */

    this.helperService.getProfile().subscribe(res => {
      this.user = res.data;
    });
    this.getCart();
    this.invokeStripe();
  }

  getCart() {
    this.cartService.getCart().subscribe((res) => {
      if (res.data) {
        this.cart = res.data;
        this.cartForm = this.toFormGroup(this.cart.books);
        this.onChanges();
      }
    });
  }

  onChanges(): void {
    this.changesSub$ = this.cartForm.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((val) => {
        if (this.lastCartState !== JSON.stringify(val)) {
          this.lastCartState = JSON.stringify(val);
          this.reCalcSum(val);
        }
      });
  }

  onRemove(id: string): void {
    this.cartService.removeFromCart(id).subscribe(() => {
      if (this.cart) {
        this.cart.books = this.cart.books.filter((b) => b._id !== id);
        this.reCalcSum(this.cartForm.value);
      }
    });
  }

  toFormGroup(books: Book[]): FormGroup {
    const group: any = {};

    books.forEach((book) => {
      if (book._id) {
        group[book._id] = new FormControl(1 || '', [
          Validators.required,
          Validators.min(1),
          Validators.max(book.qt),
        ]);
      }
    });

    group['points'] = new FormControl('', [
      Validators.min(10),
      Validators.max(this.user.points),
    ]);

    return new FormGroup(group);
  }

  reCalcSum(formValues: any): void {
    let price = 0;
    this.cartService.getCart().subscribe((res) => {
      this.cart = res.data;
      if (this.cart) {
        for (const b of this.cart.books) {
          price += b.price * formValues[b._id];
        }

        this.discont = formValues["points"] /10;

        price -= formValues["points"] /10;
      
        this.cart.totalPrice = price;
      }
    });
  }

  getControl(id: string): any {
    if (this.cartForm) {
      return this.cartForm.get(id);
    }
  }

  makePayment(amount: number) {
    this.cartService.checkout(this.cartForm.value).subscribe(() => {
      console.log('CHECKOUT');
    });
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51L70QBLKbQ516y7PB3qP69A1BqxTvN09nYIi2ZWbZMvPr6V4ipUyGPQ1ex2iNy9NtOC8XrtV2PZnhFr7jEcZYhES00FXUC4YNs',
      locale: 'auto',
      token: function (stripeToken: any) {
        paymentstripe(stripeToken);
      },
    });

    const paymentstripe = (stripeToken: any) => {
      if (stripeToken) {
        this.cartService.checkout(this.cartForm.value).subscribe(() => {
          this.route.navigate(["/profile"]);
        });
      }
    };

    paymentHandler.open({
      name: 'BOOK STORE PAYMENT',
      description: '',
      amount: amount * 100,
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51L70QBLKbQ516y7PB3qP69A1BqxTvN09nYIi2ZWbZMvPr6V4ipUyGPQ1ex2iNy9NtOC8XrtV2PZnhFr7jEcZYhES00FXUC4YNs',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
          },
        });
      };

      window.document.body.appendChild(script);
    }
  }
}
