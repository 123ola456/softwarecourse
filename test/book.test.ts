import { Book } from "../src/model/book.model";
import { bookBuilder } from "../src/model/Builder/book.builder";

describe("bookBuilder", () => {

  test("should build a Book successfully when all properties are set", () => {
    const book = new bookBuilder()
      .setTitle("The Great Gatsby")
      .setAuthor("F. Scott Fitzgerald")
      .setGenre("Fiction")
      .setFormat("Hardcover")
      .setLanguage("English")
      .setPublisher("Scribner")
      .setSpecialEdition("Anniversary Edition")
      .setPackaging("Box")
      .build();

    expect(book).toBeInstanceOf(Book);
    expect(book.getTitle()).toBe("The Great Gatsby");
    expect(book.getAuthor()).toBe("F. Scott Fitzgerald");
    expect(book.getGenre()).toBe("Fiction");
    expect(book.getFormat()).toBe("Hardcover");
    expect(book.getLanguage()).toBe("English");
    expect(book.getPublisher()).toBe("Scribner");
    expect(book.getSpecialEdition()).toBe("Anniversary Edition");
    expect(book.getPackaging()).toBe("Box");
  });

  test("should throw error if a required property is missing", () => {
    expect(() => {
      new bookBuilder()
        .setTitle("1984")
        .setAuthor("George Orwell")
        // genre missing
        .setFormat("Paperback")
        .setLanguage("English")
        .setPublisher("Secker & Warburg")
        .setSpecialEdition("None")
        .setPackaging("Bag")
        .build();
    }).toThrow("Missing required property for Cake"); 
  });

  test("should allow method chaining", () => {
    const builder = new bookBuilder()
      .setTitle("Animal Farm")
      .setAuthor("George Orwell")
      .setGenre("Political Fiction");

    expect(builder).toBeInstanceOf(bookBuilder);
  });

});
