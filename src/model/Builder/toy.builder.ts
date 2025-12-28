import {Toy,IdentifiableToy} from "../toy.model";
import logger from "../../utils/logger"
    export class toyBuilder{
    private type!: string;
    private ageGroup!: string;
    private brand!: string;
    private material!: string;
    private batteryRequired!: boolean;
    private educational!: boolean

    public static create(): toyBuilder {
    return new toyBuilder();
}
    setType(type: string): toyBuilder {
        this.type = type;
        return this;
    }
    setAgeGroup(ageGroup: string): toyBuilder {
        this.ageGroup = ageGroup;
        return this;
    }
    setBrand(brand: string): toyBuilder {
        this.brand = brand;
        return this;
    }
    setMaterial(material: string): toyBuilder {
        this.material = material;
        return this;
    }
    setBatteryRequired(batteryRequired: boolean): toyBuilder {
        this.batteryRequired = batteryRequired;
        return this;
    }
    setEducational(educational: boolean): toyBuilder {
        this.educational = educational;
        return this;
    }
    build(): Toy {
        const requiredProperties = [
            this.type,
            this.ageGroup,
            this.brand,
            this.material,
            this.batteryRequired,
            this.educational
        ];
        for (const prop of requiredProperties) {
            if(prop === undefined || prop === null) {
                throw new Error("Missing required property for Toy");
            }
        }

    return new Toy(
        this.type,
        this.ageGroup,
        this.brand,
        this.material,
        this.batteryRequired,
        this.educational
    );
    } }
     export class IdentifiableToyBuilder {
        private id!:string;
        private toy!:Toy;

        static create():IdentifiableToyBuilder{
            return new IdentifiableToyBuilder
        }
        setId(id:string):IdentifiableToyBuilder{
            this.id=id;
            return this;
        }

        setToy(toy:Toy):IdentifiableToyBuilder{
            this.toy= toy;
            return this;
        }
        build():IdentifiableToy{
            if(!this.id || !this.toy){
                logger.info("Missing required properties ,could not build IdentifiableToy");
                throw new Error("Missing required properties");
            }
            return new IdentifiableToy(
                this.id,
                this.toy.getType(),
                this.toy.getAgeGroup(),
                this.toy.getBrand(),
                this.toy.getMaterial(),
                this.toy.isBatteryRequired(),
                this.toy.isEducational(),
                
               
            )

        }
    }
 