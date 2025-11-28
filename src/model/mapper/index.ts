import fs from "fs/promises"
import { readCSVFile } from "../../utils/csvParser";
import { parseJSON } from "../../utils/jsonParser";
import { parseXml } from "../../utils/xmlParser";
import logger from "../../utils/logger";

import { csvCakeMapper } from "./cake.mapper";
import { JsonBookMapper } from "./book.mapper";
import { XmlToyMapper } from "./toy.mapper";
import { OrderMapper } from "./order.mapper";

async function main() {
    // CSV Orders
    const csvData = await readCSVFile("src/utils/csvParser.ts");
    const csvItemMapper = new csvCakeMapper();
    const csvOrderMapper = new OrderMapper(csvItemMapper);
    const csvOrders = csvData.map(csvOrderMapper.map.bind(csvOrderMapper));
    logger.info("CSV orders:\n%o", csvOrders);

    // JSON Orders
    const jsonData = await parseJSON("src/utils/jsonParser.ts");
    const jsonItemMapper = new JsonBookMapper();
    const jsonOrderMapper = new OrderMapper(jsonItemMapper);
    const jsonOrders = jsonData.map(jsonOrderMapper.map.bind(jsonOrderMapper));
    logger.info("JSON orders:\n%o", jsonOrders);

    // XML Orders
const xmlString = await fs.readFile("src/utils/xmlParser.xml", "utf8");
const xmlData = parseXml(xmlString);

if (!xmlData) {
  logger.error("XML data is null");
  return;
}

const xmlItemMapper = new XmlToyMapper();
const xmlOrderMapper = new OrderMapper(xmlItemMapper);
const xmlOrders = xmlData.map(xmlOrderMapper.map.bind(xmlOrderMapper));

logger.info("XML orders:\n%o", xmlOrders);

}

main();
