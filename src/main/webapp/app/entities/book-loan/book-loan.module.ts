import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DevLibrarySharedModule } from 'app/shared/shared.module';
import { BookLoanComponent } from './book-loan.component';
import { BookLoanDetailComponent } from './book-loan-detail.component';
import { BookLoanUpdateComponent } from './book-loan-update.component';
import { BookLoanDeleteDialogComponent } from './book-loan-delete-dialog.component';
import { bookLoanRoute } from './book-loan.route';

@NgModule({
  imports: [DevLibrarySharedModule, RouterModule.forChild(bookLoanRoute)],
  declarations: [BookLoanComponent, BookLoanDetailComponent, BookLoanUpdateComponent, BookLoanDeleteDialogComponent],
  entryComponents: [BookLoanDeleteDialogComponent]
})
export class DevLibraryBookLoanModule {}
