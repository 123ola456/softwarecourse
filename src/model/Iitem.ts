 import {ID} from "../repository/Irepository"
 export interface Iitem{
    getCategory():ItemCategory;
 }
 //interface can extands an interface
 //IIdenetifiableItem now inherits getId() from ID repo and getCategory() from Iitem repo
 //so any class implements this inetrface must have these 2  getters methods
export interface IIdentifiableItem extends ID,Iitem {
 
}

  export enum ItemCategory{
    CAKE="cake",
    TOY="toy",
    BOOK="book",
 }