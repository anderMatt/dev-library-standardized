import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { DevLibraryTestModule } from '../../../test.module';
import { BookLoanUpdateComponent } from 'app/entities/book-loan/book-loan-update.component';
import { BookLoanService } from 'app/entities/book-loan/book-loan.service';
import { BookLoan } from 'app/shared/model/book-loan.model';

describe('Component Tests', () => {
  describe('BookLoan Management Update Component', () => {
    let comp: BookLoanUpdateComponent;
    let fixture: ComponentFixture<BookLoanUpdateComponent>;
    let service: BookLoanService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DevLibraryTestModule],
        declarations: [BookLoanUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(BookLoanUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BookLoanUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BookLoanService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new BookLoan(123);
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
        const entity = new BookLoan();
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
