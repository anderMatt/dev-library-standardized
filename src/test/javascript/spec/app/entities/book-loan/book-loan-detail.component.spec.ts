import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DevLibraryTestModule } from '../../../test.module';
import { BookLoanDetailComponent } from 'app/entities/book-loan/book-loan-detail.component';
import { BookLoan } from 'app/shared/model/book-loan.model';

describe('Component Tests', () => {
  describe('BookLoan Management Detail Component', () => {
    let comp: BookLoanDetailComponent;
    let fixture: ComponentFixture<BookLoanDetailComponent>;
    const route = ({ data: of({ bookLoan: new BookLoan(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DevLibraryTestModule],
        declarations: [BookLoanDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(BookLoanDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BookLoanDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load bookLoan on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.bookLoan).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
