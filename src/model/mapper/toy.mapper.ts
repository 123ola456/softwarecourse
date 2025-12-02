import { IMapper } from "./IMapper";
import { Toy } from "../toy.model";
import { toyBuilder } from "../Builder/toy.builder";

 export interface XmlToyItem {
  Type: string;
  AgeGroup: string;
  Brand: string;
  Material: string;
  BatteryRequired: "Yes" | "No";
  Educational: "Yes" | "No";
}

export class XmlToyMapper implements IMapper<XmlToyItem, Toy> {
  map(data: XmlToyItem): Toy {
    return toyBuilder.create()
      .setType(data.Type)
      .setAgeGroup(data.AgeGroup)
      .setBrand(data.Brand)
      .setMaterial(data.Material)
      .setBatteryRequired(data.BatteryRequired === "Yes")
      .setEducational(data.Educational === "Yes")
      .build();
  }

  reverseMap(data: Toy): XmlToyItem {
    return {
      Type: data.getType(),
      AgeGroup: data.getAgeGroup(),
      Brand: data.getBrand(),
      Material: data.getMaterial(),
      BatteryRequired: data.isBatteryRequired() ? "Yes" : "No",
      Educational: data.isEducational() ? "Yes" : "No",
    };
  }
}
