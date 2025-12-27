import { Iorder } from "../Iorder";
import {  Iitem ,IIdentifiableItem} from "../Iitem";
import { IdentifiableOrderItem, Order } from "../order.model";

export class OrderBuilder {
    private item!: Iitem;
    private price!: number;
    private quantity!: number;
    private id!: string;

    public static create(): OrderBuilder {
        return new OrderBuilder();
    }
    setItem(item: Iitem): OrderBuilder {
        this.item = item;
        return this;
    }
    setPrice(price: number): OrderBuilder {
        this.price = price;
        return this;
    }
    setQuantity(quantity: number): OrderBuilder {
        this.quantity = quantity;
        return this;
    }
    setId(id: string): OrderBuilder {
        this.id = id;
        return this;
    }
    build():Order {
            const requiredProperties = [
            this.item,
            this.price,
            this.quantity,
            this.id
        ];
        for (const prop of requiredProperties) {
            if (prop === undefined || prop === null) {
                throw new Error("Missing required property for Order");
            }
        
        };
    
    return new Order(
        this.item,
        this.price,
        this.quantity,
        this.id
    );
    }
}

