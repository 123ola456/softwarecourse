import {Book} from '../book.model';
export class bookBuilder{
  private title!: string;
    private author!: string;
    private genre!: string;
    private format!: string;
    private language!: string;
    private publisher!: string;
    private specialEdition!: string;
    private packaging!: string;

    public static create(): bookBuilder {
    return new bookBuilder();
}
    setTitle(title: string): bookBuilder {
        this.title = title;
        return this;
    }
    setAuthor(author: string): bookBuilder {
        this.author = author;
        return this;
    }
    setGenre(genre: string): bookBuilder {
        this.genre = genre;
        return this;
    }
    setFormat(format: string): bookBuilder {
        this.format = format;
        return this;
    }
    setLanguage(language: string): bookBuilder {
        this.language = language;
        return this;
    }
    setPublisher(publisher: string): bookBuilder {
        this.publisher = publisher;
        return this;
    }
    setSpecialEdition(specialEdition: string): bookBuilder {
        this.specialEdition = specialEdition;
        return this;
    }
    setPackaging(packaging: string): bookBuilder {
        this.packaging = packaging;
        return this;
    }

    build(): Book {
        const requiredProperties = [
            this.title,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging
        ];
        for (const prop of requiredProperties) {
            if(!prop) {
            
                throw new Error("Missing required property for Cake");
            }
        }
        return new Book(
            this.title,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging
        );
    }
}
