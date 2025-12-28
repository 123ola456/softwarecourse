import {Iorder} from "./Iorder";
import {Iitem} from "./Iitem";

import { IIdentifiableOrderItem } from "./Iorder";
import { IIdentifiableItem } from "./Iitem";

export class Order implements Iorder {
    private item:Iitem;
    private price:number;
    private quantity:number;
    private id:string;

    constructor(item:Iitem,price:number,quantity:number,id:string){
        this.item=item;
        this.price=price;
        this.quantity=quantity;
        this.id=id;
    }

     getItem(): Iitem {
        return this.item;
    }
    getPrice(): number {
        return this.price;
    }
    getQuantity(): number {
        return this.quantity;
    }
    getId(): string {
        return this.id;
    }
}
//IIdentifiableOrderItem interface must have getId from Id interface and the method of Iorder"price quantity item id"
export class IdentifiableOrderItem  implements IIdentifiableOrderItem{
// The constructor initializes an order item by storing:
// 1) the identifiable item being ordered,
// 2) the price of that item,
// 3) the quantity ordered,
// 4) and the unique ID of the order itself.
// These values are saved as private fields so the getter methods
// (getPrice, getQuantity, getItem, getId) can return them later.
constructor(private IdentifiableItem:IIdentifiableItem ,
    private price:number,
    private quantity:number,
    private id:string){
  
}
getPrice(){
return this.price;
}
getQuantity(){
 return this.quantity;
}
getId(){
return this.id;
}
getItem():IIdentifiableItem{
    return this.IdentifiableItem;
}

}
