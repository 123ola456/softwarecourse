import { IMapper } from "./IMapper";
import { Cake } from "../cake.model";
import { cakeBuilder } from "../Builder/cake.builder";



export class csvCakeMapper implements IMapper<string[], Cake> {
  map(data:string[]): Cake {
    return cakeBuilder.create()
      .setType(data[1])
      .setFlavor(data[2])
      .setFilling(data[3])
      .setSize(Number(data[4]))
      .setLayers(Number(data[5]))
      .setFrostingType(data[6])
      .setFrostingFlavor(data[7])
      .setDecorationType(data[8])
      .setDecorationColor(data[9])
      .setCustomMessage(data[10])
      .setShape(data[11])
      .setAllergies(data[12])
      .setSpecialIngredients(data[13])
      .setPackagingType(data[14])
      .build();
  }
reverseMap(data: Cake): string[] {
  return [
    data.getType(),
    data.getFlavor(),
    data.getFilling(),
    data.getSize().toString(),
    data.getLayers().toString(),
    data.getFrostingType(),
    data.getFrostingFlavor(),
    data.getDecorationType(),
    data.getDecorationColor(),
    data.getCustomMessage(),
    data.getShape(),
    data.getAllergies(),
    data.getSpecialIngredients(),
    data.getPackagingType(),
  ];
}


}