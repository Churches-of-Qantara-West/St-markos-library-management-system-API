export class BookModel {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  authors: string[];
  translators: string[];
  categoryId: string;
  series: string;
  numberInSeries: string;
  publishers: string;
  description: string;
  pages: number;
  numberOfCopies: number;
  createdAt?: Date;
  updatedAt?: Date;
}
