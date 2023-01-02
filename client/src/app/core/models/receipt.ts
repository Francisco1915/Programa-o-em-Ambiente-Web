import { User } from './user';
import { Book } from './book';

export class Receipt {
  constructor(
    public _id: string,
    public user: User,
    public productsInfo: Book[],
    public totalPrice: number,
    public promo: number,
    public creationDate: Date
  ) { }
}
