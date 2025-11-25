import {readCSVFile} from"../../utils/csvParser";
import {csvCakeMapper} from "./cake.mapper";
import logger from"../../utils/logger";
import { CsvOrderMapper } from "./order.mapper";


async function main(){
    const data = await readCSVFile("src/utils/csvParser.ts");
    const cakeMapper = new csvCakeMapper();
    const orderMapper=new CsvOrderMapper(cakeMapper);
    const orders=data.map(orderMapper.map.bind(orderMapper));
    logger.info("list of orders:\n %o,orders ")
}
main();