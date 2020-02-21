import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICatalogEntry } from 'app/shared/model/catalog-entry.model';
import { CatalogEntryService } from './catalog-entry.service';
import { CatalogEntryDeleteDialogComponent } from './catalog-entry-delete-dialog.component';

@Component({
  selector: 'jhi-catalog-entry',
  templateUrl: './catalog-entry.component.html'
})
export class CatalogEntryComponent implements OnInit, OnDestroy {
  catalogEntries?: ICatalogEntry[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected catalogEntryService: CatalogEntryService,
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
      this.catalogEntryService
        .search({
          query: this.currentSearch
        })
        .subscribe((res: HttpResponse<ICatalogEntry[]>) => (this.catalogEntries = res.body || []));
      return;
    }

    this.catalogEntryService.query().subscribe((res: HttpResponse<ICatalogEntry[]>) => (this.catalogEntries = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInCatalogEntries();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ICatalogEntry): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInCatalogEntries(): void {
    this.eventSubscriber = this.eventManager.subscribe('catalogEntryListModification', () => this.loadAll());
  }

  delete(catalogEntry: ICatalogEntry): void {
    const modalRef = this.modalService.open(CatalogEntryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.catalogEntry = catalogEntry;
  }
}
