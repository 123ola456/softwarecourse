import { csvCakeMapper } from "../src/model/mapper/cake.mapper";
import { Cake } from "../src/model/cake.model";

describe("csvCakeMapper", () => {
  it("should correctly map CSV data to a Cake object", () => {
    const mapper = new csvCakeMapper();

    const data = [
      "0",                // ignored index
      "Birthday",         // type
      "Strawberry",       // flavor
      "Vanilla",          // filling
      "2",                // size
      "10",               // layers
      "ButterCream",      // frostingType
      "Vanilla",          // frostingFlavor
      "Sprinkles",        // decorationType
      "Blue",             // decorationColor
      "Happy Birthday",   // customMessage
      "Round",            // shape
      "None",             // allergies
      "None",             // specialIngredients
      "Box"               // packagingType
    ];

    const cake = mapper.map(data);

    expect(cake.getType()).toBe("Birthday");
    expect(cake.getFlavor()).toBe("Strawberry");
    expect(cake.getFilling()).toBe("Vanilla");
    expect(cake.getSize()).toBe(2);
    expect(cake.getLayers()).toBe(10);
    expect(cake.getFrostingType()).toBe("ButterCream");
    expect(cake.getFrostingFlavor()).toBe("Vanilla");
    expect(cake.getDecorationType()).toBe("Sprinkles");
    expect(cake.getDecorationColor()).toBe("Blue");
    expect(cake.getCustomMessage()).toBe("Happy Birthday");
    expect(cake.getShape()).toBe("Round");
    expect(cake.getAllergies()).toBe("None");
    expect(cake.getSpecialIngredients()).toBe("None");
    expect(cake.getPackagingType()).toBe("Box");
  });
});
