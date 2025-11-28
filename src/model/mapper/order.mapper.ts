import { IMapper } from "./IMapper";
import { Order } from "../order.model";
import { OrderBuilder } from "../Builder/order.builder";
import { Iitem } from "../Iitem";
import { Iorder } from "../../model/Iorder";
import { JsonBookMapper } from "./book.mapper";


export class OrderMapper implements IMapper<string[], Order>{
    constructor(private itemMapper:IMapper<string[],Iitem>){
    }
map(data : string[]):Order{
    const item:Iitem=this.itemMapper.map(data);

return OrderBuilder.create()
.setItem(item)
.setQuantity(parseInt(data[data.length-1]))
.setPrice(parseInt(data[data.length-2]))
.setId(data[0])
.build();
}


reverseMap(data:Iorder):string[]{
    const item =this.itemMapper.reverseMap(data.getItem());
    return [
        data.getId(),
        ...item,
        data.getPrice().toString(),
        data.getQuantity().toString()
    ]
}
}