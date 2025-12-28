import { IMapper } from "./IMapper";
import { Book,IdentifiableBook } from "../book.model";
import { bookBuilder,IdentifiableBookBuilder } from "../Builder/book.builder";
/*We created JsonBookItem to give TypeScript a strict structure for the JSON book fields, 
 while the parser stays generic and returns raw data so the mapper can transform it into a mode*/
export interface JsonBookItem {
  "Book Title": string;
  "Author": string;
  "Genre": string;
  "Format": string;
  "Language": string;
  "Publisher": string;
  "Special Edition": string;
  "Packaging": string;

}

export class JsonBookMapper implements IMapper<JsonBookItem, Book> {
  map(data: JsonBookItem): Book {
    return bookBuilder.create()
      .setTitle(data["Book Title"])
      .setAuthor(data["Author"])
      .setGenre(data["Genre"])
      .setFormat(data["Format"])
      .setLanguage(data["Language"])
      .setPublisher(data["Publisher"])
      .setSpecialEdition(data["Special Edition"])
      .setPackaging(data["Packaging"])
      .build();
  }

  reverseMap(data: Book): JsonBookItem {
    return {
     
      "Book Title": data.getTitle(),
      "Author": data.getAuthor(),
      "Genre": data.getGenre(),
      "Format": data.getFormat(),
      "Language": data.getLanguage(),
      "Publisher": data.getPublisher(),
      "Special Edition": data.getSpecialEdition(),
      "Packaging": data.getPackaging(),
    
      
    };
  }
}
//represnts sqlite table row 
export interface SQLiteBook {
  id:string;
  title: string,
    author: string,
    genre: string,
    format: string,
    language: string,
    publisher: string,
    specialEdition: string,
    packaging: string,

}
//converting between row table and IdentifiableToy object 
export class SQLiteBookMapper implements IMapper<SQLiteBook,IdentifiableBook>{
  map(data:SQLiteBook):IdentifiableBook{
return IdentifiableBookBuilder.newBuilder()
.setCake(bookBuilder.create()
.setTitle(data.title)
.setAuthor(data.author)
.setGenre(data.genre)
.setFormat(data.format)
.setLanguage(data.language)
.setPublisher(data.publisher)
.setSpecialEdition(data.specialEdition)
.setPackaging(data.packaging)
.build())
.setId(data.id)
.build()

  }
  reverseMap(data: IdentifiableBook): SQLiteBook {
    return{
    id:data.getId(),
    title:data.getTitle(),
    author:data.getAuthor(),
    genre:data.getGenre(),
    format:data.getFormat(),
    language:data.getLanguage(),
    publisher:data.getPublisher(),
    specialEdition:data.getSpecialEdition(),
    packaging:data.getPackaging(),
    
    

    
    }
    
  }
}