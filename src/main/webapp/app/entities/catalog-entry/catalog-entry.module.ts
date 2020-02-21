import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DevLibrarySharedModule } from 'app/shared/shared.module';
import { CatalogEntryComponent } from './catalog-entry.component';
import { CatalogEntryDetailComponent } from './catalog-entry-detail.component';
import { CatalogEntryUpdateComponent } from './catalog-entry-update.component';
import { CatalogEntryDeleteDialogComponent } from './catalog-entry-delete-dialog.component';
import { catalogEntryRoute } from './catalog-entry.route';

@NgModule({
  imports: [DevLibrarySharedModule, RouterModule.forChild(catalogEntryRoute)],
  declarations: [CatalogEntryComponent, CatalogEntryDetailComponent, CatalogEntryUpdateComponent, CatalogEntryDeleteDialogComponent],
  entryComponents: [CatalogEntryDeleteDialogComponent]
})
export class DevLibraryCatalogEntryModule {}
