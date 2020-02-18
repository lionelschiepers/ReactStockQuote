import _ from 'lodash';
import parser  from 'csv-parse/lib/sync';
import axios from 'axios';

class SecurityPostion
{
  Ticker;
  Market;
  NumberOfShares = 0;
  MarketCost = 0;
  Currency;
  Name;
  Transactions = [];
  PastGain = 0;
}

class CurrencyHelper
{
  static updateCurrency = (positions) =>
  {
    _.forEach(positions, (position)=>
    {
      if (position.Ticker.indexOf('.') < 0)
        position.Currency = "USD";
      else if (position.Ticker.endsWith(".SW"))
        position.Currency = "CHF";
      else if (position.Ticker.endsWith(".L"))
        position.Currency = "GBp";
      else if (position.Ticker.endsWith(".OL"))
        position.Currency = "NOK";
      else 
        position.Currency = 'EUR';
    });
  }
}



export class Portfolio
{ 
    // Loads the specified transactions
    // sample file: https://raw.githubusercontent.com/lionelschiepers/MyStock/master/MyStockWeb/Data/1.csv
    async Load (url) 
     {
        
        const result = [];
          axios
            .get(url)
            .then(res => {
                const parsedCsv = parser(res.data, {columns:true});

                _.forEach(parsedCsv, (data)=>
            {
              data.Shares = parseFloat(data.Shares);
              data.Price = parseFloat(data.Price);
              data.Commission = parseFloat(data.Commission);
              
              let item = _.find(result, (o) => o.Ticker === data.Symbol);
              if (item == null)
              {
                item = new SecurityPostion();
                item.Ticker = data.Symbol;
                item.Name = data.Name;
                result.push(item);
              }
                switch(data.Type.toLowerCase())
                {
                  case 'buy':
                    item.NumberOfShares += parseFloat(data.Shares);
                    item.MarketCost +=  Math.abs(parseFloat(data.Shares)) * parseFloat(data.Price);
                    item.MarketCost += parseFloat(data.Commission);
                    item.Transactions.push(data);
                    break;
                  case 'sell':
                    // calculate the past gain with the last transactions.
                    while(data.Shares > 0)
                    {
                      let lastTransaction = _.last(item.Transactions);
                      let x = Math.min(lastTransaction.Shares, data.Shares);
                      item.MarketCost -= x * lastTransaction.Price;
                      lastTransaction.Shares -= x;
                      data.Shares -= x;
                      item.PastGain += x * data.Price;
                      

                      if (lastTransaction.Shares === 0)
                        item.Transactions.pop();
                    }
                    break;

                    case 'deposit cash':
                      item.PastGain += data.Commission;
                      break;
                    default:
                      break;
                      
                }
              });

              CurrencyHelper.updateCurrency(result);

              let totalMarketCost = 0;
              let eurPositions = _.filter(result, (o) => o.Currency === "EUR");

              _.forEach(eurPositions, (o) => totalMarketCost+=o.MarketCost + o.PastGain);
              // let totalCurrentPrice = 0;
      });
      
    }
}