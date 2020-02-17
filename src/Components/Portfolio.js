import _ from 'lodash';
import { csvParse } from 'csv-parse/lib/sync';
import axios from 'axios';


export class Portfolio
{ 
    // Loads the specified transactions
    // sample file: https://raw.githubusercontent.com/lionelschiepers/MyStock/master/MyStockWeb/Data/1.csv
    Load = async(url) => {
        const stream = csvParse.parse({});
        let test =  csvParse.parse('TOTO', {});
        const result = [];
        /*
        const parser = csvParser({separator: ','});

          parser.on('readable', () => {
            let record
            while (record = parser.read()) 
            {
              output.push(record)
            }
          });
*/
          axios
            .get(url)
      .then(res => {
          
        const data = csvParse.parse(res.data, {});
        result.push(data);
      
      });
      
    }
}