import { IMapper } from "./IMapper";
import { Book } from "../book.model";
import { bookBuilder } from "../Builder/book.builder";
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
