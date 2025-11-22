import { Cake } from "../cake.model";
import { cakeBuilder } from "./cake.builder";
import { bookBuilder } from "./book.builder";
import { toyBuilder } from "./toy.builder";

function main() {
   const cake: Cake = new cakeBuilder()
    .setType("type")
    .setFlavor("flavor")
    .setFilling("filling")
    .setSize(10)
    .setLayers(2)
    .setFrostingType("frostingType")
    .setFrostingFlavor("frostingFlavor")
    .setDecorationType("decorationType")
    .setDecorationColor("decorationColor")
    .setCustomMessage("customMessage")
    .setShape("shape")
    .setAllergies("allergies")
    .setSpecialIngredients("specialIngredients")
    .setPackagingType("packagingType")
    .build();


}

main();
