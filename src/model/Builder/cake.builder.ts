import { Cake } from "../cake.model";


 export class cakeBuilder{
 private type!: string;//without ! typescript will complain that these properties are possibly undefined,so we reassign them in the setter method
private flavor!: string;
private filling!: string;
private size!: number;
private layers!: number;
private frostingType!: string;
private frostingFlavor!: string;
private decorationType!: string;
private decorationColor!: string;
private customMessage!: string;
private shape!: string;
private allergies!: string;
private specialIngredients!: string;
private packagingType!: string;
 
public static create(): cakeBuilder {
    return new cakeBuilder();
}
 setType (type: string):cakeBuilder {//cakeBuilder is the return type
    this.type = type;//assigning the parameter to the private property
    return this;//returning the current instance to allow method chaining
}
   setFlavor(flavor: string): cakeBuilder {
        this.flavor = flavor;
        return this;
       
    }
    setFilling (filling: string):cakeBuilder {
    this.filling = filling;
    return this;
}
    setSize (size: number):cakeBuilder {
    this.size = size;
    return this;
}
    setLayers (layers: number):cakeBuilder {
    this.layers = layers;
    return this;
}
    setFrostingType (frostingType: string):cakeBuilder {
    this.frostingType = frostingType;
    return this;

}
    setFrostingFlavor (frostingFlavor: string):cakeBuilder{
    this.frostingFlavor = frostingFlavor;
    return this;

}
    setDecorationType (decorationType: string):cakeBuilder {
    this.decorationType = decorationType;
    return this;

}
    setDecorationColor (decorationColor: string):cakeBuilder {
    this.decorationColor = decorationColor;
    return this;
}
    setCustomMessage (customMessage: string):cakeBuilder {
    this.customMessage = customMessage;
    return this;
    }
    setShape (shape: string):cakeBuilder {
    this.shape = shape;
    return this;
        
}
    setAllergies (allergies: string):cakeBuilder {
    this.allergies = allergies;
    return this;
}
    setSpecialIngredients (specialIngredients: string): cakeBuilder{
    this.specialIngredients = specialIngredients;
    return this;
}
    setPackagingType (packagingType: string):cakeBuilder{
    this.packagingType = packagingType;
    return this;
}


    build(): Cake {
        const requiredProperties = [
    this.type,
    this.flavor,
    this.filling,
    this.size,
    this.layers,
    this.frostingType,
    this.frostingFlavor,
    this.decorationType,
    this.decorationColor,
    this.customMessage,
    this.shape,
    this.allergies,
    this.specialIngredients,
    this.packagingType
        ];
        for (const prop of requiredProperties) {
            if(prop === undefined || prop === null) { 
            
                throw new Error("Missing required property for Cake");
            }
        }

    return new Cake(
    
    this.type,
    this.flavor,
    this.filling,
    this.size,
    this.layers,
    this.frostingType,
    this.frostingFlavor,
    this.decorationType,
    this.decorationColor,
    this.customMessage,
    this.shape,
    this.allergies,
    this.specialIngredients,
    this.packagingType
    );
    }
    }
 