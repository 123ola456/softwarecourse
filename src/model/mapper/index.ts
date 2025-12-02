import { readCSVFile } from "../../utils/csvParser";
import { parseJSON } from "../../utils/jsonParser";
import { parseXml } from "../../utils/xmlParser";
import logger from "../../utils/logger";
import fs from "fs/promises";
import { OrderMapper } from "./order.mapper";
import { csvCakeMapper } from "./cake.mapper";
import { JsonBookMapper } from "./book.mapper";
import { XmlToyMapper } from "./toy.mapper";
import { Cake } from "model/cake.model";

async function main() {
  try {
    
    // --- CSV Orders ---
    // Read CSV file, convert each row into a Cake object wrapped in an Iorder (including id, price, quantity), and log all orders

    const csvData = await readCSVFile("src/data/cake orders.csv");
    const cakeMapper = new csvCakeMapper();
    const csvOrderMapper = new OrderMapper<string[], Cake>(cakeMapper);
    const ordersFromCSV = csvData.map(csvOrderMapper.map.bind(csvOrderMapper));
    logger.info("CSV Orders:\n%o", ordersFromCSV);
   


    // --- JSON Orders ---
    const jsonData = await parseJSON("src/data/book orders.json");
    const bookMapper = new JsonBookMapper();
    const jsonOrderMapper = new OrderMapper<any, any>(bookMapper);
    const ordersFromJSON = jsonData.map(jsonOrderMapper.map.bind(jsonOrderMapper));
    logger.info("JSON Orders:\n%o", ordersFromJSON);

  

// --- XML Orders ---
const xmlString = await fs.readFile("src/data/toy orders.xml", "utf-8");
const rawXmlData = parseXml(xmlString);

const xmlData: Record<string, any>[] = rawXmlData?.data?.row || [];

const toyMapper = new XmlToyMapper();
const xmlOrderMapper = new OrderMapper<Record<string, any>, any>(toyMapper);
const ordersFromXML = xmlData.map(xmlOrderMapper.map.bind(xmlOrderMapper));

logger.info("XML Orders:\n%o", ordersFromXML);


  } catch (error) {
    logger.error("Error reading or mapping orders:", error);
  }
}

main();

