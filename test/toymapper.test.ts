<<<<<<< HEAD
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
=======
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
>>>>>>> 85bbad9 (fixing mappers and adding their tests)

    expect(toy).toBeInstanceOf(Toy);
    expect(toy.getType()).toBe("Action Figure");
    expect(toy.getAgeGroup()).toBe("6-12");
    expect(toy.getBrand()).toBe("Hasbro");
    expect(toy.getMaterial()).toBe("Plastic");
    expect(toy.isBatteryRequired()).toBe(true);
    expect(toy.isEducational()).toBe(false);
  });

<<<<<<< HEAD
  test("reverseMap() should convert Toy object back to CSV array", () => {
    const toy = toyBuilder.create()
=======
  test("reverseMap() should convert Toy instance back to XML/JSON object", () => {
    const toy: Toy = toyBuilder.create()
>>>>>>> 85bbad9 (fixing mappers and adding their tests)
      .setType("Doll")
      .setAgeGroup("3-6")
      .setBrand("Barbie")
      .setMaterial("Plastic")
      .setBatteryRequired(false)
      .setEducational(true)
      .build();

<<<<<<< HEAD
    const result = mapper.reverseMap(toy);

    expect(result).toEqual([
      "Doll",
      "3-6",
      "Barbie",
      "Plastic",
      "No",
      "Yes"
    ]);
=======
    const result: XmlToyItem = mapper.reverseMap(toy);

    expect(result).toEqual({
      Type: "Doll",
      AgeGroup: "3-6",
      Brand: "Barbie",
      Material: "Plastic",
      BatteryRequired: "No",
      Educational: "Yes"
    });
>>>>>>> 85bbad9 (fixing mappers and adding their tests)
  });
});
