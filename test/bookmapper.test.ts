<<<<<<< HEAD
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
    
=======
import { JsonBookMapper, JsonBookItem } from "../src/model/mapper/book.mapper";
import { bookBuilder } from "../src/model/Builder/book.builder";
import { Book } from "../src/model/book.model";

describe("JsonBookMapper", () => {
  const mapper = new JsonBookMapper();

  test("map() should convert JSON object to Book instance", () => {
    const jsonBook: JsonBookItem = {
      "Book Title": "The Great Gatsby",
      "Author": "F. Scott Fitzgerald",
      "Genre": "Fiction",
      "Format": "Hardcover",
      "Language": "English",
      "Publisher": "Scribner",
      "Special Edition": "First Edition",
      "Packaging": "Standard"
    };

    const book: Book = mapper.map(jsonBook);

    expect(book).toBeInstanceOf(Book);
    expect(book.getTitle()).toBe("The Great Gatsby");
    expect(book.getAuthor()).toBe("F. Scott Fitzgerald");
    expect(book.getGenre()).toBe("Fiction");
    expect(book.getFormat()).toBe("Hardcover");
    expect(book.getLanguage()).toBe("English");
    expect(book.getPublisher()).toBe("Scribner");
    expect(book.getSpecialEdition()).toBe("First Edition");
    expect(book.getPackaging()).toBe("Standard");
  });

  test("reverseMap() should convert Book instance back to JSON object", () => {
    const book: Book = bookBuilder.create()
      .setTitle("1984")
      .setAuthor("George Orwell")
      .setGenre("Dystopian")
      .setFormat("Paperback")
      .setLanguage("English")
      .setPublisher("Secker & Warburg")
      .setSpecialEdition("Special Edition")
      .setPackaging("Luxury")
      .build();

    const result: JsonBookItem = mapper.reverseMap(book);

    expect(result).toEqual({
      "Book Title": "1984",
      "Author": "George Orwell",
      "Genre": "Dystopian",
      "Format": "Paperback",
      "Language": "English",
      "Publisher": "Secker & Warburg",
      "Special Edition": "Special Edition",
      "Packaging": "Luxury"
    });
>>>>>>> 85bbad9 (fixing mappers and adding their tests)
  });
});
