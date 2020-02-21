import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'book',
        loadChildren: () => import('./book/book.module').then(m => m.DevLibraryBookModule)
      },
      {
        path: 'catalog-entry',
        loadChildren: () => import('./catalog-entry/catalog-entry.module').then(m => m.DevLibraryCatalogEntryModule)
      },
      {
        path: 'book-loan',
        loadChildren: () => import('./book-loan/book-loan.module').then(m => m.DevLibraryBookLoanModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class DevLibraryEntityModule {}
