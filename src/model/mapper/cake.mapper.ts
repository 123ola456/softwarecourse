import { IMapper } from "./IMapper";
import { Cake, IdentifiableCake } from "../cake.model";
import { cakeBuilder, IdentifiableCakeBuilder } from "../Builder/cake.builder";



export class csvCakeMapper implements IMapper<string[], Cake> {
  map(data:string[]): Cake {
    return cakeBuilder.create()
      .setType(data[1])
      .setFlavor(data[2])
      .setFilling(data[3])
      .setSize(parseInt(data[4]))
      .setLayers(parseInt(data[5]))
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
//represnts sqlite table row 
export interface SQLiteCake {
  id: string;
  type: string,
  flavor: string,
  filling: string,
  size: number,
  layers: number,
  frostingType: string,
  frostingFlavor: string,
  decorationType: string,
  decorationColor: string,
  customMessage: string,
  shape: string,
  allergies: string,
  specialIngredients: string,
  packagingType: string
}
//converting between row table and IdentifiableCake object 
export class SQLiteCakeMapper implements IMapper<SQLiteCake,IdentifiableCake>{
  map(data:SQLiteCake):IdentifiableCake{
return IdentifiableCakeBuilder.newBuilder()
.setCake(cakeBuilder.create()
.setType(data.type)
.setFlavor(data.flavor)
.setFilling(data.filling)
.setSize(data.size)
.setLayers(data.layers)
.setFrostingType(data.frostingType)
.setFrostingFlavor(data.frostingFlavor)
.setDecorationType(data.decorationType)
.setDecorationColor(data.decorationColor)
.setCustomMessage(data.customMessage)
.setShape(data.shape)
.setAllergies(data.allergies)
.setSpecialIngredients(data.specialIngredients)
.setPackagingType(data.packagingType)
.build())
.setId(data.id)
.build()

  }
  reverseMap(data: IdentifiableCake): SQLiteCake {
    return{
    id:data.getId(),
    type:data.getType(),
    flavor:data.getFlavor(),
    filling:data.getFilling(),
    size:data.getSize(),
    layers:data.getLayers(),
    frostingType:data.getFrostingType(),
    frostingFlavor:data.getFrostingFlavor(),
    decorationType:data.getDecorationType(),
    decorationColor:data.getDecorationColor(),
    customMessage:data.getCustomMessage(),
    shape:data.getShape(),
    allergies:data.getAllergies(),
    specialIngredients:data.getSpecialIngredients(),
    packagingType:data.getPackagingType()
    

    
    }
    
  }
}
export class JsonRequestCakeMapper implements IMapper<any, IdentifiableCake> {


  map(data: any): IdentifiableCake{
 
    const cake = cakeBuilder.create()
     .setType(data.type)
     .setFlavor(data.flavor)
     .setFilling(data.filling)
     .setSize(data.size)
      .setLayers(data.layers)
      .setFrostingType(data.frostingType)
      .setFrostingFlavor(data.frostingFlavor)
      .setDecorationType(data.decorationType)
      .setDecorationColor(data.decorationColor)
      .setCustomMessage(data.customMessage)
      .setShape(data.shape)
      .setAllergies(data.allergies)
      .setSpecialIngredients(data.specialIngredients)
      .setPackagingType(data.packagingType)
      .build();

return IdentifiableCakeBuilder.newBuilder()

.setCake(cake)
.setId(data.id)
.build();
  }

  reverseMap(data: IdentifiableCake) {
    return {
      id:data.getId(),
    type:data.getType(),
    flavor:data.getFlavor(),
    filling:data.getFilling(),
    size:data.getSize(),
    layers:data.getLayers(),
    frostingType:data.getFrostingType(),
    frostingFlavor:data.getFrostingFlavor(),
    decorationType:data.getDecorationType(),
    decorationColor:data.getDecorationColor(),
    customMessage:data.getCustomMessage(),
    shape:data.getShape(),
    allergies:data.getAllergies(),
    specialIngredients:data.getSpecialIngredients(),
    packagingType:data.getPackagingType()
    
    };
  }
}