import {Iitem} from "./Iitem"
export interface Iorder {
    getPrice():number,
    getQuantity():number,
    getItem():Iitem,
    getId():string,
}