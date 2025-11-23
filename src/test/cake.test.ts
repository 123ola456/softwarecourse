// cakeBuilder.test.ts
import { Cake } from "../model/cake.model";
import { cakeBuilder } from "../model/Builder/cake.builder";

describe("cakeBuilder", () => {

  test("should build a Cake successfully when all properties are set", () => {
    const cake = cakeBuilder.create()
      .setType("Birthday")
      .setFlavor("Vanilla")
      .setFilling("Cream")
      .setSize(8)
      .setLayers(2)
      .setFrostingType("Buttercream")
      .setFrostingFlavor("Chocolate")
      .setDecorationType("Sprinkles")
      .setDecorationColor("Rainbow")
      .setCustomMessage("Happy Birthday!")
      .setShape("Round")
      .setAllergies("None")
      .setSpecialIngredients("Strawberries")
      .setPackagingType("Box")
      .build();

    expect(cake).toBeInstanceOf(Cake);
    expect(cake.getType()).toBe("Birthday");
    expect(cake.getFlavor()).toBe("Vanilla");
    expect(cake.getFilling()).toBe("Cream");
    expect(cake.getSize()).toBe(8);
    expect(cake.getLayers()).toBe(2);
    expect(cake.getFrostingType()).toBe("Buttercream");
    expect(cake.getFrostingFlavor()).toBe("Chocolate");
    expect(cake.getDecorationType()).toBe("Sprinkles");
    expect(cake.getDecorationColor()).toBe("Rainbow");
    expect(cake.getCustomMessage()).toBe("Happy Birthday!");
    expect(cake.getShape()).toBe("Round");
    expect(cake.getAllergies()).toBe("None");
    expect(cake.getSpecialIngredients()).toBe("Strawberries");
    expect(cake.getPackagingType()).toBe("Box");
  });

  test("should throw error if a required property is missing", () => {
    expect(() => {
      cakeBuilder.create()
        .setType("Wedding")
        // flavor missing
        .setFilling("Cream")
        .setSize(12)
        .setLayers(3)
        .setFrostingType("Fondant")
        .setFrostingFlavor("Vanilla")
        .setDecorationType("Flowers")
        .setDecorationColor("White")
        .setCustomMessage("Congratulations!")
        .setShape("Heart")
        .setAllergies("None")
        .setSpecialIngredients("Almonds")
        .setPackagingType("Box")
        .build();
    }).toThrow("Missing required property for Cake");
  });

  test("should allow method chaining", () => {
    const builder = cakeBuilder.create()
      .setType("Anniversary")
      .setFlavor("Chocolate")
      .setFilling("Ganache")
      .setSize(10);

    expect(builder).toBeInstanceOf(cakeBuilder);
  });

});
