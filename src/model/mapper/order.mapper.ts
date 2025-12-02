import { IMapper } from "./IMapper";
import { Order } from "../order.model";
import { OrderBuilder } from "../Builder/order.builder";
import { Iitem } from "../Iitem";
import { Iorder } from "model/Iorder";

// OrderMapper maps raw data (T) into an Order containing a valid item (U).
// U must extend Iitem to ensure all items have required methods like getCategory(),
// keeping orders type-safe and consistent across different item types (Cake, Toy, Book).

export class OrderMapper<T, U extends Iitem> implements IMapper<T, Iorder> {

    // Stores the item mapper to convert raw item data (T) into a proper item object (U)
    constructor(private itemMapper: IMapper<T, U>) {}

// Converts raw data (T) into an order object implementing Iorder, 
// mapping the item, and assigning id, price, and quantity
    map(data: T): Iorder {
        const item: U = this.itemMapper.map(data);

        let id: string;
        let price: number;
        let quantity: number;


        if (Array.isArray(data)) {
            // CSV: first = id, last 2 = price & quantity
            const row = data  as string[];
            id = row[0];
            price = parseInt(row[row.length - 2]);
            quantity = parseInt(row[row.length - 1]);
        } else {
            // Handle JSON/XML input: adapt property names from different sources to a consistent format
            // 'Order ID', 'Price', 'Quantity' might have different capitalizations or naming conventions
            // Convert price and quantity to numbers to ensure consistent typing for Iorder
            const obj = data as any;
            id = obj["Order ID"] ?? obj.OrderID ?? obj.id;
            price = Number(obj["Price"] ?? obj.Price ?? obj.price);
            quantity = Number(obj["Quantity"] ?? obj.Quantity ?? obj.quantity);
        }

        return OrderBuilder.create()
            .setItem(item)
            .setPrice(price)
            .setQuantity(quantity)
            .setId(id)
            .build();
    }

    reverseMap(order: Iorder): T {
        const itemData = this.itemMapper.reverseMap(order.getItem() as U);

        if (Array.isArray(itemData)) {
            return ([order.getId(), ...itemData, order.getPrice().toString(), order.getQuantity().toString()] as unknown) as T;
        } else if (typeof itemData === "object" && itemData !== null) {
            return ({
                "Order ID": order.getId(),
                ...itemData,
                Price: order.getPrice(),
                Quantity: order.getQuantity(),
            } as unknown) as T;
        } else {
            throw new Error("Item data must be array or object");
        }
    }
}

