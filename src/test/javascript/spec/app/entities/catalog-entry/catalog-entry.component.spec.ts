import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { DevLibraryTestModule } from '../../../test.module';
import { CatalogEntryComponent } from 'app/entities/catalog-entry/catalog-entry.component';
import { CatalogEntryService } from 'app/entities/catalog-entry/catalog-entry.service';
import { CatalogEntry } from 'app/shared/model/catalog-entry.model';

describe('Component Tests', () => {
  describe('CatalogEntry Management Component', () => {
    let comp: CatalogEntryComponent;
    let fixture: ComponentFixture<CatalogEntryComponent>;
    let service: CatalogEntryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DevLibraryTestModule],
        declarations: [CatalogEntryComponent]
      })
        .overrideTemplate(CatalogEntryComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CatalogEntryComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CatalogEntryService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new CatalogEntry(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.catalogEntries && comp.catalogEntries[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
