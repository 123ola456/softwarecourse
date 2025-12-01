// toyBuilder.test.ts
import { Toy } from "../src/model/toy.model";
import { toyBuilder } from "../src/model/Builder/toy.builder";

describe.only("toyBuilder", () => {

  test("should build a Toy successfully when all properties are set", () => {
    const toy = new toyBuilder()
      .setType("Action Figure")
      .setAgeGroup("5-10")
      .setBrand("FunBrand")
      .setMaterial("Plastic")
      .setBatteryRequired(false)
      .setEducational(true)
      .build();

    expect(toy).toBeInstanceOf(Toy);
    expect(toy.getType()).toBe("Action Figure");
    expect(toy.getAgeGroup()).toBe("5-10");
    expect(toy.getBrand()).toBe("FunBrand");
    expect(toy.getMaterial()).toBe("Plastic");
    expect(toy.isBatteryRequired()).toBe(false);
    expect(toy.isEducational()).toBe(true);
  });

  test("should throw error if a required property is missing", () => {
    expect(() => {
      new toyBuilder()
        .setType("Puzzle")
        .setAgeGroup("3-6")
        // brand missing
        .setMaterial("Wood")
        .setBatteryRequired(false)
        .setEducational(true)
        .build();
    }).toThrow("Missing required property for Toy");
  });

  test("should allow method chaining", () => {
    const builder = new toyBuilder()
      .setType("Puzzle")
      .setAgeGroup("3-6")
      .setBrand("Brainy")
      .setMaterial("Wood")
      .setBatteryRequired(false)
      .setEducational(true);

    expect(builder).toBeInstanceOf(toyBuilder);
  });

 test("should accept falsy boolean values without throwing", () => {
  const toy = new toyBuilder()
    .setType("Robot")
    .setAgeGroup("8+")
    .setBrand("RoboFun")
    .setMaterial("Metal")
    .setBatteryRequired(false)
    .setEducational(false)
    .build();

  expect(toy.isBatteryRequired()).toBe(false);
  expect(toy.isEducational()).toBe(false);
});


});