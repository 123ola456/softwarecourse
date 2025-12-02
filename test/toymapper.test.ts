import { XmlToyMapper, XmlToyItem } from "../src/model/mapper/toy.mapper";
import { toyBuilder } from "../src/model/Builder/toy.builder";
import { Toy } from "../src/model/toy.model";

describe("XmlToyMapper", () => {
  const mapper = new XmlToyMapper();

  test("map() should convert XML/JSON toy object to Toy instance", () => {
    const xmlToy: XmlToyItem = {
      Type: "Action Figure",
      AgeGroup: "6-12",
      Brand: "Hasbro",
      Material: "Plastic",
      BatteryRequired: "Yes",
      Educational: "No"
    };

    const toy: Toy = mapper.map(xmlToy);

    expect(toy).toBeInstanceOf(Toy);
    expect(toy.getType()).toBe("Action Figure");
    expect(toy.getAgeGroup()).toBe("6-12");
    expect(toy.getBrand()).toBe("Hasbro");
    expect(toy.getMaterial()).toBe("Plastic");
    expect(toy.isBatteryRequired()).toBe(true);
    expect(toy.isEducational()).toBe(false);
  });

  test("reverseMap() should convert Toy instance back to XML/JSON object", () => {
    const toy: Toy = toyBuilder.create()
      .setType("Doll")
      .setAgeGroup("3-6")
      .setBrand("Barbie")
      .setMaterial("Plastic")
      .setBatteryRequired(false)
      .setEducational(true)
      .build();

    const result: XmlToyItem = mapper.reverseMap(toy);

    expect(result).toEqual({
      Type: "Doll",
      AgeGroup: "3-6",
      Brand: "Barbie",
      Material: "Plastic",
      BatteryRequired: "No",
      Educational: "Yes"
    });
  });
});
