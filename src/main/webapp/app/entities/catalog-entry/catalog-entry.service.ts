import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Search } from 'app/shared/util/request-util';
import { ICatalogEntry } from 'app/shared/model/catalog-entry.model';

type EntityResponseType = HttpResponse<ICatalogEntry>;
type EntityArrayResponseType = HttpResponse<ICatalogEntry[]>;

@Injectable({ providedIn: 'root' })
export class CatalogEntryService {
  public resourceUrl = SERVER_API_URL + 'api/catalog-entries';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/catalog-entries';

  constructor(protected http: HttpClient) {}

  create(catalogEntry: ICatalogEntry): Observable<EntityResponseType> {
    return this.http.post<ICatalogEntry>(this.resourceUrl, catalogEntry, { observe: 'response' });
  }

  update(catalogEntry: ICatalogEntry): Observable<EntityResponseType> {
    return this.http.put<ICatalogEntry>(this.resourceUrl, catalogEntry, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICatalogEntry>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICatalogEntry[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICatalogEntry[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
