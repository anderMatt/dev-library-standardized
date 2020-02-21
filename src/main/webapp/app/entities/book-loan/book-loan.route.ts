import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IBookLoan, BookLoan } from 'app/shared/model/book-loan.model';
import { BookLoanService } from './book-loan.service';
import { BookLoanComponent } from './book-loan.component';
import { BookLoanDetailComponent } from './book-loan-detail.component';
import { BookLoanUpdateComponent } from './book-loan-update.component';

@Injectable({ providedIn: 'root' })
export class BookLoanResolve implements Resolve<IBookLoan> {
  constructor(private service: BookLoanService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBookLoan> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((bookLoan: HttpResponse<BookLoan>) => {
          if (bookLoan.body) {
            return of(bookLoan.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BookLoan());
  }
}

export const bookLoanRoute: Routes = [
  {
    path: '',
    component: BookLoanComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'BookLoans'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: BookLoanDetailComponent,
    resolve: {
      bookLoan: BookLoanResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'BookLoans'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: BookLoanUpdateComponent,
    resolve: {
      bookLoan: BookLoanResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'BookLoans'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: BookLoanUpdateComponent,
    resolve: {
      bookLoan: BookLoanResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'BookLoans'
    },
    canActivate: [UserRouteAccessService]
  }
];
