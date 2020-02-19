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
  MarketPrice;
  MarketPriceEUR;
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

  getGain()
  {
    if (this.MarketPrice == null || this.MarketCost == null)
      return null;
    if (this.NumberOfShares === 0)
      return null;

    return this.MarketPrice - this.MarketCost;
  }

  getPriceDiff()
  {
    let price = this.Security == null ? null : this.Security.regularMarketPrice;
    let previousPrice = this.Security == null ? null : this.Security.regularMarketPreviousClose;
    if (price == null || previousPrice == null)
      return null;
        
    return 100.0 * ((price / previousPrice) - 1.0);
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
    async Load (url) 
     {
        
        const result = [];

          await axios
            .get(url)
            .then(res => {
                const parsedCsv = parser(res.data, {columns:true});

                _.forEach(parsedCsv, (data)=>
            {
              data.Shares = Math.abs(parseFloat(data.Shares));
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
                    item.NumberOfShares += data.Shares;
                    item.MarketCost +=  data.Shares * data.Price + data.Commission;
                    item.Transactions.push(data);
                    break;
                  case 'sell':
                    // calculate the past gain with the last transactions.

                    if (data.symbol === 'PUM.DE')
                      console.log('');

                    while(data.Shares > 0)
                    {
                      let lastTransaction = _.last(item.Transactions);
                      let x = Math.min(lastTransaction.Shares, data.Shares);
                      item.MarketCost -= x * lastTransaction.Price + lastTransaction.Commission;
                      item.NumberOfShares -= x;
                      lastTransaction.Shares -= x;
                      data.Shares -= x;
                      item.PastGain += x * (data.Price - lastTransaction.Price);

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
      let yahooData = await loader.Load(tickers, [YahooFinanceFields.RegularMarketPrice, YahooFinanceFields.RegularMarketPreviousClose]);
      result.forEach(o => o.Security = yahooData.find(y => y.symbol === o.Ticker));

      result.forEach(position =>
        {
          if (position.Security == null)
            return;
          if (position.Security.regularMarketPrice == null)
            return;

          position.MarketPrice = position.Security.regularMarketPrice * position.NumberOfShares;
          position.MarketPriceEUR = position.RateToEUR * position.MarketPrice
        });

        /*
        let totalMarketPrice = 0;
        result
        .filter(o=>o.MarketPriceEUR != null)
        .forEach(o => 
          {
            totalMarketPrice += o.MarketPriceEUR
          });

              let totalMarketCost = 0;
              let eurPositions = _.filter(result, (o) => o.Currency === "EUR");

              _.forEach(eurPositions, (o) => totalMarketCost+=o.MarketCost + o.PastGain);
              // let totalCurrentPrice = 0;
*/
              return result;
      
    }
}