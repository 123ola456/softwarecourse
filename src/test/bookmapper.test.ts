import { JsonBookMapper} from "../model/mapper/book.mapper";
import { Book } from "../model/book.model";


describe("csvBookMapper", () => {
  it("should correctly map CSV data to a book object", () => {
    const mapper = new JsonBookMapper();

    const data = [
        "Edge of Eternity",
        "Dan Brown",
        "Science Fiction",
        "Paperback",
        "French",
        "Oxford Press",
        "Signed Copy",
        "Eco-Friendly Packaging",
       
    ];

    const book = mapper.map(data);

    expect(book.getTitle()).toBe("Edge of Eternity");
    expect(book.getAuthor()).toBe("Dan Brown");
    expect(book.getGenre()).toBe("Science Fiction");
    expect(book.getFormat()).toBe("Paperback");
    expect(book.getLanguage()).toBe("French");
    expect(book.getPublisher()).toBe("Oxford Press");
    expect(book.getSpecialEdition()).toBe("Signed Copy");
    expect(book.getPackaging()).toBe("Eco-Friendly Packaging");
    
  });
});
