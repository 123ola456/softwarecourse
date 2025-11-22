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

const book= new bookBuilder()
    .setTitle("title") 
    .setAuthor("author")
    .setGenre("genre")
    .setFormat("format")
    .setLanguage("language")
    .setPublisher("publisher")
    .setSpecialEdition("specialEdition")
    .setPackaging("packaging")
    .build();
    
    const toy= new toyBuilder()
    .setType("type")
    .setAgeGroup("ageGroup")
    .setBrand("brand")
    .setMaterial("material")
    .setBatteryRequired(true)
    .setEducational(true)
    .build();
    
    console.log(toy);
    console.log(book);
    console.log(cake);
}

main();
