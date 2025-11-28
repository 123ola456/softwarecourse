import { XmlToyMapper} from "../model/mapper/toy.mapper";
import { toyBuilder } from "../model/Builder/toy.builder";
import { Toy } from "../model/toy.model";

describe("csvToyMapper", () => {
  const mapper = new XmlToyMapper();

  test("map() should convert CSV string[] to Toy object", () => {
    const csvRow = [
      "0",            
      "Action Figure",
      "6-12",
      "Hasbro",
      "Plastic",
      "Yes",
      "No"
    ];

    const toy = mapper.map(csvRow);

    expect(toy).toBeInstanceOf(Toy);
    expect(toy.getType()).toBe("Action Figure");
    expect(toy.getAgeGroup()).toBe("6-12");
    expect(toy.getBrand()).toBe("Hasbro");
    expect(toy.getMaterial()).toBe("Plastic");
    expect(toy.isBatteryRequired()).toBe(true);
    expect(toy.isEducational()).toBe(false);
  });

  test("reverseMap() should convert Toy object back to CSV array", () => {
    const toy = toyBuilder.create()
      .setType("Doll")
      .setAgeGroup("3-6")
      .setBrand("Barbie")
      .setMaterial("Plastic")
      .setBatteryRequired(false)
      .setEducational(true)
      .build();

    const result = mapper.reverseMap(toy);

    expect(result).toEqual([
      "Doll",
      "3-6",
      "Barbie",
      "Plastic",
      "No",
      "Yes"
    ]);
  });
});
