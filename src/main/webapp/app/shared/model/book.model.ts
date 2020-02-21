export interface IBook {
  id?: number;
  isbn?: string;
  title?: string;
  description?: string;
  author?: string;
  genre?: string;
  imageUrl?: string;
}

export class Book implements IBook {
  constructor(
    public id?: number,
    public isbn?: string,
    public title?: string,
    public description?: string,
    public author?: string,
    public genre?: string,
    public imageUrl?: string
  ) {}
}
