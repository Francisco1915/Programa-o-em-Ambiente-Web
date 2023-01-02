import { User } from './user';
import { Book } from '../models/book';

export class Request {
  constructor(
    public user: User,
    public books: Book[],
    public status: boolean
  ) {}
}
