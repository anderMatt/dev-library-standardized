import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICatalogEntry } from 'app/shared/model/catalog-entry.model';

@Component({
  selector: 'jhi-catalog-entry-detail',
  templateUrl: './catalog-entry-detail.component.html'
})
export class CatalogEntryDetailComponent implements OnInit {
  catalogEntry: ICatalogEntry | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ catalogEntry }) => (this.catalogEntry = catalogEntry));
  }

  previousState(): void {
    window.history.back();
  }
}
