import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IBookLoan, BookLoan } from 'app/shared/model/book-loan.model';
import { BookLoanService } from './book-loan.service';
import { IBook } from 'app/shared/model/book.model';
import { BookService } from 'app/entities/book/book.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

type SelectableEntity = IBook | IUser;

@Component({
  selector: 'jhi-book-loan-update',
  templateUrl: './book-loan-update.component.html'
})
export class BookLoanUpdateComponent implements OnInit {
  isSaving = false;
  books: IBook[] = [];
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    checkOutDateTime: [],
    dueDateTime: [],
    returnedDateTime: [],
    book: [],
    borrower: []
  });

  constructor(
    protected bookLoanService: BookLoanService,
    protected bookService: BookService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookLoan }) => {
      if (!bookLoan.id) {
        const today = moment().startOf('day');
        bookLoan.checkOutDateTime = today;
        bookLoan.dueDateTime = today;
        bookLoan.returnedDateTime = today;
      }

      this.updateForm(bookLoan);

      this.bookService
        .query({ filter: 'bookloan-is-null' })
        .pipe(
          map((res: HttpResponse<IBook[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IBook[]) => {
          if (!bookLoan.book || !bookLoan.book.id) {
            this.books = resBody;
          } else {
            this.bookService
              .find(bookLoan.book.id)
              .pipe(
                map((subRes: HttpResponse<IBook>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IBook[]) => (this.books = concatRes));
          }
        });

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(bookLoan: IBookLoan): void {
    this.editForm.patchValue({
      id: bookLoan.id,
      checkOutDateTime: bookLoan.checkOutDateTime ? bookLoan.checkOutDateTime.format(DATE_TIME_FORMAT) : null,
      dueDateTime: bookLoan.dueDateTime ? bookLoan.dueDateTime.format(DATE_TIME_FORMAT) : null,
      returnedDateTime: bookLoan.returnedDateTime ? bookLoan.returnedDateTime.format(DATE_TIME_FORMAT) : null,
      book: bookLoan.book,
      borrower: bookLoan.borrower
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bookLoan = this.createFromForm();
    if (bookLoan.id !== undefined) {
      this.subscribeToSaveResponse(this.bookLoanService.update(bookLoan));
    } else {
      this.subscribeToSaveResponse(this.bookLoanService.create(bookLoan));
    }
  }

  private createFromForm(): IBookLoan {
    return {
      ...new BookLoan(),
      id: this.editForm.get(['id'])!.value,
      checkOutDateTime: this.editForm.get(['checkOutDateTime'])!.value
        ? moment(this.editForm.get(['checkOutDateTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      dueDateTime: this.editForm.get(['dueDateTime'])!.value
        ? moment(this.editForm.get(['dueDateTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      returnedDateTime: this.editForm.get(['returnedDateTime'])!.value
        ? moment(this.editForm.get(['returnedDateTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      book: this.editForm.get(['book'])!.value,
      borrower: this.editForm.get(['borrower'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBookLoan>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
