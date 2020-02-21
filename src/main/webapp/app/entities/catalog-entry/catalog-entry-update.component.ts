import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ICatalogEntry, CatalogEntry } from 'app/shared/model/catalog-entry.model';
import { CatalogEntryService } from './catalog-entry.service';
import { IBook } from 'app/shared/model/book.model';
import { BookService } from 'app/entities/book/book.service';

@Component({
  selector: 'jhi-catalog-entry-update',
  templateUrl: './catalog-entry-update.component.html'
})
export class CatalogEntryUpdateComponent implements OnInit {
  isSaving = false;
  books: IBook[] = [];

  editForm = this.fb.group({
    id: [],
    inventoryCount: [],
    book: []
  });

  constructor(
    protected catalogEntryService: CatalogEntryService,
    protected bookService: BookService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ catalogEntry }) => {
      this.updateForm(catalogEntry);

      this.bookService
        .query({ filter: 'catalogentry-is-null' })
        .pipe(
          map((res: HttpResponse<IBook[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IBook[]) => {
          if (!catalogEntry.book || !catalogEntry.book.id) {
            this.books = resBody;
          } else {
            this.bookService
              .find(catalogEntry.book.id)
              .pipe(
                map((subRes: HttpResponse<IBook>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IBook[]) => (this.books = concatRes));
          }
        });
    });
  }

  updateForm(catalogEntry: ICatalogEntry): void {
    this.editForm.patchValue({
      id: catalogEntry.id,
      inventoryCount: catalogEntry.inventoryCount,
      book: catalogEntry.book
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const catalogEntry = this.createFromForm();
    if (catalogEntry.id !== undefined) {
      this.subscribeToSaveResponse(this.catalogEntryService.update(catalogEntry));
    } else {
      this.subscribeToSaveResponse(this.catalogEntryService.create(catalogEntry));
    }
  }

  private createFromForm(): ICatalogEntry {
    return {
      ...new CatalogEntry(),
      id: this.editForm.get(['id'])!.value,
      inventoryCount: this.editForm.get(['inventoryCount'])!.value,
      book: this.editForm.get(['book'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICatalogEntry>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IBook): any {
    return item.id;
  }
}
