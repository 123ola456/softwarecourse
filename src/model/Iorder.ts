import {IIdentifiableItem, Iitem} from "./Iitem";
import {ID} from"../repository/Irepository";

export interface Iorder {
    getPrice():number,
    getQuantity():number,
    getItem():Iitem,
    getId():string,
}
//lama naamel extend we can change the return type of a method like here 
export interface IIdentifiableOrderItem extends Iorder,ID{
getItem():IIdentifiableItem;
}