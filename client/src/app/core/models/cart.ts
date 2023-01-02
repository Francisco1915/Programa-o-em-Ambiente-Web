import { User } from './user';
import { Book } from '../models/book';

export class Cart {
  constructor(
    public user: User,
    public books: Book[],
    public totalPrice: number,
  ) { }
}