import { IBook } from 'app/shared/model/book.model';

export interface ICatalogEntry {
  id?: number;
  inventoryCount?: number;
  book?: IBook;
}

export class CatalogEntry implements ICatalogEntry {
  constructor(public id?: number, public inventoryCount?: number, public book?: IBook) {}
}
