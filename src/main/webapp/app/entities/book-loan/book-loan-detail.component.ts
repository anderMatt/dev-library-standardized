import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBookLoan } from 'app/shared/model/book-loan.model';

@Component({
  selector: 'jhi-book-loan-detail',
  templateUrl: './book-loan-detail.component.html'
})
export class BookLoanDetailComponent implements OnInit {
  bookLoan: IBookLoan | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookLoan }) => (this.bookLoan = bookLoan));
  }

  previousState(): void {
    window.history.back();
  }
}
