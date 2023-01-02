export class Book {
  constructor(
    public _id: string,
    public title: string,
    public author: string,
    public desc: string,
    public date: Date,
    public isbn: string,
    public price: number,
    public status: string,
    public type:string,
    public qt: number,
    public emphasis: string,
    public coverImageName: string,
  ) { }
}