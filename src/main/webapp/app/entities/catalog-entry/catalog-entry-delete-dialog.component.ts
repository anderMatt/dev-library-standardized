import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICatalogEntry } from 'app/shared/model/catalog-entry.model';
import { CatalogEntryService } from './catalog-entry.service';

@Component({
  templateUrl: './catalog-entry-delete-dialog.component.html'
})
export class CatalogEntryDeleteDialogComponent {
  catalogEntry?: ICatalogEntry;

  constructor(
    protected catalogEntryService: CatalogEntryService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.catalogEntryService.delete(id).subscribe(() => {
      this.eventManager.broadcast('catalogEntryListModification');
      this.activeModal.close();
    });
  }
}
