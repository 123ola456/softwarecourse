import { IMapper } from "./IMapper";
import { Book } from "../book.model";
import { bookBuilder } from "../Builder/book.builder";

export class JsonBookMapper implements IMapper<string[],Book>{
    map(data:string[]):Book{
        return bookBuilder.create()
        .setTitle(data[0])
        .setAuthor(data[1])
        .setGenre(data[2])
        .setFormat(data[3])
        .setLanguage(data[4])
        .setPublisher(data[5])
        .setSpecialEdition(data[6])
        .setPackaging(data[7])
      .build();
    }
    reverseMap(data: Book): string[] {
return[
data.getTitle(),
data.getAuthor(),
data.getGenre(),
data.getFormat(),
data.getLanguage(),
data.getPublisher(),
data.getSpecialEdition(),
data.getPackaging()

];

    }
}