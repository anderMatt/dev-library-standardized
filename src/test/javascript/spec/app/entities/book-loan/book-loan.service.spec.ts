import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { BookLoanService } from 'app/entities/book-loan/book-loan.service';
import { IBookLoan, BookLoan } from 'app/shared/model/book-loan.model';

describe('Service Tests', () => {
  describe('BookLoan Service', () => {
    let injector: TestBed;
    let service: BookLoanService;
    let httpMock: HttpTestingController;
    let elemDefault: IBookLoan;
    let expectedResult: IBookLoan | IBookLoan[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(BookLoanService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new BookLoan(0, currentDate, currentDate, currentDate);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            checkOutDateTime: currentDate.format(DATE_TIME_FORMAT),
            dueDateTime: currentDate.format(DATE_TIME_FORMAT),
            returnedDateTime: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a BookLoan', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            checkOutDateTime: currentDate.format(DATE_TIME_FORMAT),
            dueDateTime: currentDate.format(DATE_TIME_FORMAT),
            returnedDateTime: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            checkOutDateTime: currentDate,
            dueDateTime: currentDate,
            returnedDateTime: currentDate
          },
          returnedFromService
        );

        service.create(new BookLoan()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a BookLoan', () => {
        const returnedFromService = Object.assign(
          {
            checkOutDateTime: currentDate.format(DATE_TIME_FORMAT),
            dueDateTime: currentDate.format(DATE_TIME_FORMAT),
            returnedDateTime: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            checkOutDateTime: currentDate,
            dueDateTime: currentDate,
            returnedDateTime: currentDate
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of BookLoan', () => {
        const returnedFromService = Object.assign(
          {
            checkOutDateTime: currentDate.format(DATE_TIME_FORMAT),
            dueDateTime: currentDate.format(DATE_TIME_FORMAT),
            returnedDateTime: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            checkOutDateTime: currentDate,
            dueDateTime: currentDate,
            returnedDateTime: currentDate
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a BookLoan', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
