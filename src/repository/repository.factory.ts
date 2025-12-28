import { ItemCategory } from "../model/Iitem";
import {IIdentifiableOrderItem, Iorder} from "../model/Iorder";
import { Irepository,Intializable } from "./Irepository";
import { cakeOrderRepository } from "./file/cake.order.repository";
import { CakePgRepository}from "../postgresql/cakepg.repository"
import { BookPgRepository } from "../postgresql/bookpg.repository";
import { ToyPgRepository } from "../postgresql/toypg.repository";
import config from "../config"
import { OrderRepository } from "./file/sqlite/order.repository";
import { CakeRepository } from "./file/sqlite/Cake.order.repository";
import { OrderPgRepository } from "postgresql/orderpg.repository";

export enum DBMode {
    SQLITE,
    FILE,
    POSTGRESQL
}
/*The RepositoryFactory decides which repository class to use based on:
the item type (Cake, Toy, Book, etc.)
The storage/database type (SQLite, PostgreSQL, MySQL, CSV, etc.)*/

export class RepositoryFactory {

    public static async create(mode : DBMode, category: ItemCategory): Promise<Irepository<IIdentifiableOrderItem>> {
        switch (mode) {
            case DBMode.SQLITE: {
                let repository: Irepository<IIdentifiableOrderItem> & Intializable;
                switch (category) {
                    case ItemCategory.CAKE:
                        repository = new OrderRepository(new CakeRepository());
                        break;
                        default:
                            throw new Error("Unsupported category");
                    }
                  

                await repository.init();
                return repository;
            }
            case DBMode.POSTGRESQL:{
                let repository: Irepository<IIdentifiableOrderItem> & Intializable;
                switch (category) {
                    case ItemCategory.CAKE:
                        repository = new OrderPgRepository(new CakePgRepository());
                        break;
                    case ItemCategory.BOOK:
                        repository = new OrderPgRepository(new BookPgRepository());
                        break;
                    case ItemCategory.TOY:
                        repository = new OrderPgRepository(new ToyPgRepository());
                        break;
                    default:
                        throw new Error("Unsupported category");
                }
                 await repository.init();
                return repository;
            }
  
            // deprecated file mode
            case DBMode.FILE: {
                throw new Error("File mode is deprecated");
            }
        }
    }
}