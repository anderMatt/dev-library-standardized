import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICatalogEntry, CatalogEntry } from 'app/shared/model/catalog-entry.model';
import { CatalogEntryService } from './catalog-entry.service';
import { CatalogEntryComponent } from './catalog-entry.component';
import { CatalogEntryDetailComponent } from './catalog-entry-detail.component';
import { CatalogEntryUpdateComponent } from './catalog-entry-update.component';

@Injectable({ providedIn: 'root' })
export class CatalogEntryResolve implements Resolve<ICatalogEntry> {
  constructor(private service: CatalogEntryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICatalogEntry> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((catalogEntry: HttpResponse<CatalogEntry>) => {
          if (catalogEntry.body) {
            return of(catalogEntry.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CatalogEntry());
  }
}

export const catalogEntryRoute: Routes = [
  {
    path: '',
    component: CatalogEntryComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'CatalogEntries'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CatalogEntryDetailComponent,
    resolve: {
      catalogEntry: CatalogEntryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'CatalogEntries'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CatalogEntryUpdateComponent,
    resolve: {
      catalogEntry: CatalogEntryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'CatalogEntries'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CatalogEntryUpdateComponent,
    resolve: {
      catalogEntry: CatalogEntryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'CatalogEntries'
    },
    canActivate: [UserRouteAccessService]
  }
];
