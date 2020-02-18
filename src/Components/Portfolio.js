import _ from 'lodash';
import parser  from 'csv-parse/lib/sync';
import axios from 'axios';
import { GetRate } from './ExchangeRates';
import{ YahooFinanceLoader, YahooFinanceFields } from './YahooFinanceLoader'

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
  RateToEUR = 1;
  Security; // price of one share

  PriceInEur()
  {
    return this.NumberOfShares * this.Security.Price * this.RateToEUR; 
  }
}

class CurrencyHelper
{
  static async updateCurrency (positions)
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

    for (let i = 0; i<positions.length; i++)
    {
      if (positions[i].Currency !== 'EUR')
        positions[i].RateToEUR = await GetRate(positions[i].Currency, 'EUR');
    }
  }
}

export class Portfolio
{ 
    // Loads the specified transactions
    // sample file: https://raw.githubusercontent.com/lionelschiepers/MyStock/master/MyStockWeb/Data/1.csv
    Load = async(url) => {
        
        const result = [];

          await axios
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
      });

      await CurrencyHelper.updateCurrency(result);

      const tickers = result.map(o=> o.Ticker);

      let loader = new YahooFinanceLoader();
      for(let i = 0; i<result.length; i++)
      {
        let yahooData = await loader.Load(tickers, [YahooFinanceFields.RegularMarketPrice]);

        result.map(o => {
          o.Security = yahooData.find(y => y.Ticker === o.Ticker);
        });
      }

              let totalMarketCost = 0;
              let eurPositions = _.filter(result, (o) => o.Currency === "EUR");

              _.forEach(eurPositions, (o) => totalMarketCost+=o.MarketCost + o.PastGain);
              // let totalCurrentPrice = 0;
      
    }
}