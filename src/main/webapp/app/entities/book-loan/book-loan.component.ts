import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBookLoan } from 'app/shared/model/book-loan.model';
import { BookLoanService } from './book-loan.service';
import { BookLoanDeleteDialogComponent } from './book-loan-delete-dialog.component';

@Component({
  selector: 'jhi-book-loan',
  templateUrl: './book-loan.component.html'
})
export class BookLoanComponent implements OnInit, OnDestroy {
  bookLoans?: IBookLoan[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected bookLoanService: BookLoanService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll(): void {
    if (this.currentSearch) {
      this.bookLoanService
        .search({
          query: this.currentSearch
        })
        .subscribe((res: HttpResponse<IBookLoan[]>) => (this.bookLoans = res.body || []));
      return;
    }

    this.bookLoanService.query().subscribe((res: HttpResponse<IBookLoan[]>) => (this.bookLoans = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInBookLoans();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IBookLoan): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInBookLoans(): void {
    this.eventSubscriber = this.eventManager.subscribe('bookLoanListModification', () => this.loadAll());
  }

  delete(bookLoan: IBookLoan): void {
    const modalRef = this.modalService.open(BookLoanDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bookLoan = bookLoan;
  }
}
