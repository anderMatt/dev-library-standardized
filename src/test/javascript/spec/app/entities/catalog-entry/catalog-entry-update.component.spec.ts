import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { DevLibraryTestModule } from '../../../test.module';
import { CatalogEntryUpdateComponent } from 'app/entities/catalog-entry/catalog-entry-update.component';
import { CatalogEntryService } from 'app/entities/catalog-entry/catalog-entry.service';
import { CatalogEntry } from 'app/shared/model/catalog-entry.model';

describe('Component Tests', () => {
  describe('CatalogEntry Management Update Component', () => {
    let comp: CatalogEntryUpdateComponent;
    let fixture: ComponentFixture<CatalogEntryUpdateComponent>;
    let service: CatalogEntryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DevLibraryTestModule],
        declarations: [CatalogEntryUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CatalogEntryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CatalogEntryUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CatalogEntryService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CatalogEntry(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new CatalogEntry();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
