import { ItemCategory } from "../model/Iitem";
import { csvCakeMapper } from "../model/mapper/cake.mapper";
import { JsonBookMapper} from "../model/mapper/book.mapper";
import { XmlToyMapper } from "../model/mapper/toy.mapper";

// Factory that returns the correct mapper for each item type
export class MapperFactory {
    public static create(category: ItemCategory) {
        switch (category) {
            case ItemCategory.CAKE:
                return new csvCakeMapper();
            case ItemCategory.BOOK:
                return new JsonBookMapper();
            case ItemCategory.TOY:
                return new XmlToyMapper();
            default:
                throw new Error(`Mapper not found for category: ${category}`);
        }
    }
}
