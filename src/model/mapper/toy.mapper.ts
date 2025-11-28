import { IMapper } from "./IMapper";
import { Toy } from "../toy.model";
import { toyBuilder } from "../Builder/toy.builder";

export class XmlToyMapper implements IMapper<string[], Toy> {
  map(data: string[]): Toy {
    return toyBuilder.create()
      .setType(data[1])
      .setAgeGroup(data[2])
      .setBrand(data[3])
      .setMaterial(data[4])
      .setBatteryRequired(data[5] === "Yes")
      .setEducational(data[6] === "Yes")
      .build();
  }

  reverseMap(data: Toy): string[] {
    return [
      data.getType(),
      data.getAgeGroup(),
      data.getBrand(),
      data.getMaterial(),
      data.isBatteryRequired ()? "Yes" : "No",
      data.isEducational() ? "Yes" : "No",
   
    ];
  }
}
