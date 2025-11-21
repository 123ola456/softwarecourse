import logger from "./utils/logger";
import { readCSVFile } from "./utils/csvParser"; 
import { parseJSON } from './utils/jsonParser';
import { parseXml } from './utils/xmlParser';

async function main(){
  const data=await readCSVFile("src/data/cake orders.csv");
  //for each datarow,log the row
  data.forEach((row)=>logger.info(row));
   
  // JSON
  const jsonData = await parseJSON('src/data/cakeOrders.json');
  jsonData.forEach(item => logger.info(item));

  // XML
  const xmlString = fs.readFileSync('src/data/cakeOrders.xml', 'utf-8');
  const xmlData = parseXml(xmlString);
  logger.info(xmlData);
}


main();

