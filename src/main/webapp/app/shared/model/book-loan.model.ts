import { Moment } from 'moment';
import { IBook } from 'app/shared/model/book.model';
import { IUser } from 'app/core/user/user.model';

export interface IBookLoan {
  id?: number;
  checkOutDateTime?: Moment;
  dueDateTime?: Moment;
  returnedDateTime?: Moment;
  book?: IBook;
  borrower?: IUser;
}

export class BookLoan implements IBookLoan {
  constructor(
    public id?: number,
    public checkOutDateTime?: Moment,
    public dueDateTime?: Moment,
    public returnedDateTime?: Moment,
    public book?: IBook,
    public borrower?: IUser
  ) {}
}
