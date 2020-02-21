import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBookLoan } from 'app/shared/model/book-loan.model';
import { BookLoanService } from './book-loan.service';

@Component({
  templateUrl: './book-loan-delete-dialog.component.html'
})
export class BookLoanDeleteDialogComponent {
  bookLoan?: IBookLoan;

  constructor(protected bookLoanService: BookLoanService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bookLoanService.delete(id).subscribe(() => {
      this.eventManager.broadcast('bookLoanListModification');
      this.activeModal.close();
    });
  }
}
