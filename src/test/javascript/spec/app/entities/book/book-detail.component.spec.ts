import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DevLibraryTestModule } from '../../../test.module';
import { BookDetailComponent } from 'app/entities/book/book-detail.component';
import { Book } from 'app/shared/model/book.model';

describe('Component Tests', () => {
  describe('Book Management Detail Component', () => {
    let comp: BookDetailComponent;
    let fixture: ComponentFixture<BookDetailComponent>;
    const route = ({ data: of({ book: new Book(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DevLibraryTestModule],
        declarations: [BookDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(BookDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BookDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load book on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.book).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
