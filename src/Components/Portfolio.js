import _ from 'lodash';
import parser  from 'csv-parse/lib/sync';
import axios from 'axios';


export class Portfolio
{ 
    // Loads the specified transactions
    // sample file: https://raw.githubusercontent.com/lionelschiepers/MyStock/master/MyStockWeb/Data/1.csv
    Load = async(url) => {
        
        const result = [];
          axios
            .get(url)
            .then(res => {
                const data = parser(res.data, {columns:true});
                result.push(...data);
 
      });
      
    }
}