import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DevLibraryTestModule } from '../../../test.module';
import { CatalogEntryDetailComponent } from 'app/entities/catalog-entry/catalog-entry-detail.component';
import { CatalogEntry } from 'app/shared/model/catalog-entry.model';

describe('Component Tests', () => {
  describe('CatalogEntry Management Detail Component', () => {
    let comp: CatalogEntryDetailComponent;
    let fixture: ComponentFixture<CatalogEntryDetailComponent>;
    const route = ({ data: of({ catalogEntry: new CatalogEntry(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DevLibraryTestModule],
        declarations: [CatalogEntryDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CatalogEntryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CatalogEntryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load catalogEntry on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.catalogEntry).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
