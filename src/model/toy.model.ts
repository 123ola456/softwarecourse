import { Iitem, ItemCategory,IIdentifiableItem } from "./Iitem";
import{id} from "../repository/Irepository"
export class Toy implements Iitem {
  getCategory(): ItemCategory {
    return ItemCategory.TOY;
  }

  private type: string;
  private ageGroup: string;
  private brand: string;
  private material: string;
  private batteryRequired: boolean;
  private educational: boolean;


  constructor(
    type: string,
    ageGroup: string,
    brand: string,
    material: string,
    batteryRequired: boolean,
    educational: boolean,
  
  ) {
    this.type = type;
    this.ageGroup = ageGroup;
    this.brand = brand;
    this.material = material;
    this.batteryRequired = batteryRequired;
    this.educational = educational;
  
  }

  getType(): string {
    return this.type;
  }

  getAgeGroup(): string {
    return this.ageGroup;
  }

  getBrand(): string {
    return this.brand;
  }

  getMaterial(): string {
    return this.material;
  }

  isBatteryRequired(): boolean {
    return this.batteryRequired;
  }

  isEducational(): boolean {
    return this.educational;
  }

}
//implementing IIdentifiableItem and using its getId() method and getCategory() its inherited
//automatically from Toy
export class IdentifiableToy extends Toy implements IIdentifiableItem{
// Constructor initializes both the child-specific property `id`
//  and all parent class (`Cake`) properties

  constructor(
    private id: id,
    type: string,
    ageGroup: string,
    brand: string,
    material: string,
    batteryRequired: boolean,
    educational: boolean,

  ){
    // Call parent class constructor to initialize inherited Cake properties
    super(
     type,
    ageGroup,
    brand,
    material,
    batteryRequired,
    educational,
  
    )}
    getId(): id{
      return this.id;
   }
  
  }
