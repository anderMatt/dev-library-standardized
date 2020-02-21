import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Search } from 'app/shared/util/request-util';
import { IBookLoan } from 'app/shared/model/book-loan.model';

type EntityResponseType = HttpResponse<IBookLoan>;
type EntityArrayResponseType = HttpResponse<IBookLoan[]>;

@Injectable({ providedIn: 'root' })
export class BookLoanService {
  public resourceUrl = SERVER_API_URL + 'api/book-loans';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/book-loans';

  constructor(protected http: HttpClient) {}

  create(bookLoan: IBookLoan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bookLoan);
    return this.http
      .post<IBookLoan>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(bookLoan: IBookLoan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bookLoan);
    return this.http
      .put<IBookLoan>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBookLoan>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBookLoan[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBookLoan[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(bookLoan: IBookLoan): IBookLoan {
    const copy: IBookLoan = Object.assign({}, bookLoan, {
      checkOutDateTime: bookLoan.checkOutDateTime && bookLoan.checkOutDateTime.isValid() ? bookLoan.checkOutDateTime.toJSON() : undefined,
      dueDateTime: bookLoan.dueDateTime && bookLoan.dueDateTime.isValid() ? bookLoan.dueDateTime.toJSON() : undefined,
      returnedDateTime: bookLoan.returnedDateTime && bookLoan.returnedDateTime.isValid() ? bookLoan.returnedDateTime.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.checkOutDateTime = res.body.checkOutDateTime ? moment(res.body.checkOutDateTime) : undefined;
      res.body.dueDateTime = res.body.dueDateTime ? moment(res.body.dueDateTime) : undefined;
      res.body.returnedDateTime = res.body.returnedDateTime ? moment(res.body.returnedDateTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((bookLoan: IBookLoan) => {
        bookLoan.checkOutDateTime = bookLoan.checkOutDateTime ? moment(bookLoan.checkOutDateTime) : undefined;
        bookLoan.dueDateTime = bookLoan.dueDateTime ? moment(bookLoan.dueDateTime) : undefined;
        bookLoan.returnedDateTime = bookLoan.returnedDateTime ? moment(bookLoan.returnedDateTime) : undefined;
      });
    }
    return res;
  }
}
