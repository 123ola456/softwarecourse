import { IMapper } from "./IMapper";
import { Toy,IdentifiableToy } from "../toy.model";
import { toyBuilder,IdentifiableToyBuilder } from "../Builder/toy.builder";

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
//represnts postgresql table row 
export interface SQLiteToy {
  id:string;
  type: string,
  ageGroup: string,
  brand: string,
  material: string,
  batteryRequired: boolean,
  educational: boolean,
}
//converting between row table and IdentifiableToy object 
export class SQLiteToyMapper implements IMapper<SQLiteToy,IdentifiableToy>{
  map(data:SQLiteToy):IdentifiableToy{
return IdentifiableToyBuilder.create()
.setToy(toyBuilder.create()
.setType(data.type)
.setAgeGroup(data.ageGroup)
.setBrand(data.brand)
.setMaterial(data.material)
.setBatteryRequired(data.batteryRequired)
.setEducational(data.educational)
.build())

.setId(data.id)
.build()
  
  }
  reverseMap(data: IdentifiableToy): SQLiteToy{
    return{
    id:data.getId(),
    type:data.getType(),  
    ageGroup:data.getAgeGroup(),
    brand:data.getBrand(),
    material:data.getMaterial(),
    batteryRequired:data.isBatteryRequired(),
    educational:data.isEducational(),
    
    

    
    }
    
  }
}
