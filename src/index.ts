import logger from "./utils/logger";
import { readCSVFile } from "./utils/csvParser"; 

async function main(){
  const data=await readCSVFile("src/data/cake orders.csv");
  //for each datarow,log the row
data.forEach((row)=>logger.info(row));
}
main();

