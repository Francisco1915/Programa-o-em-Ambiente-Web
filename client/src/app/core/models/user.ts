import { Cart } from './cart';
import { Receipt } from './receipt';

export class User {
    constructor(
      public _id: string,
      public name: string,
      public email: string,
      public phone: string,
      public password: string,
      public date: Date,
      public points: number,
      public role: string,
      public gender: string,
      public cart: Cart,
      public receipts: Receipt[]
    ) { }
  }