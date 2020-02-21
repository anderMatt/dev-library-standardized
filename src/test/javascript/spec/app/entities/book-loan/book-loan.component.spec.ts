import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { DevLibraryTestModule } from '../../../test.module';
import { BookLoanComponent } from 'app/entities/book-loan/book-loan.component';
import { BookLoanService } from 'app/entities/book-loan/book-loan.service';
import { BookLoan } from 'app/shared/model/book-loan.model';

describe('Component Tests', () => {
  describe('BookLoan Management Component', () => {
    let comp: BookLoanComponent;
    let fixture: ComponentFixture<BookLoanComponent>;
    let service: BookLoanService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DevLibraryTestModule],
        declarations: [BookLoanComponent]
      })
        .overrideTemplate(BookLoanComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BookLoanComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BookLoanService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new BookLoan(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.bookLoans && comp.bookLoans[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
