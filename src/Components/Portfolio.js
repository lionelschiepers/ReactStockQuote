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
  MarketCostEUR = 0;
  MarketPrice = 0;
  MarketPriceEUR = 0;
  Currency;
  Name;
  Transactions = [];
  PastGain = 0;
  PastGainEUR = 0;
  RateToEUR = 1;
  Security; // price of one share
 
  getGain(inEur = false)
  {
    if (this.MarketPrice == null || this.MarketCost == null)
      return null;
    if (this.NumberOfShares === 0)
      return null;

      if (inEur)
      return this.MarketPriceEUR - this.MarketCostEUR;
      
    return this.MarketPrice - this.MarketCost;
  }

  getDayGain(inEUR)
  {
    let price = this.Security == null ? null : this.Security.regularMarketPrice;
    let previousPrice = this.Security == null ? null : this.Security.regularMarketPreviousClose;
    if (price == null || previousPrice == null)
      return 0.0;
    
    let gain = (price - previousPrice) * this.NumberOfShares;

    return inEUR === false ? gain : gain * this.RateToEUR; 
  }

  getDayDiff()
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
  // sets the currency of the positions using the market.
  static async updateCurrency (positions)
  {
    for (let i = 0; i<positions.length; i++)
    {
      let position = positions[i];

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

      position.RateToEUR = await GetRate(position.Currency, 'EUR');
    }
  }
}

export class Portfolio
{ 
  getDayDiff(positions)
  {
    let marketPrice = 0;
    let dayGain = 0;

    positions.filter(position => position.NumberOfShares > 0).forEach(position => {
      marketPrice += position.MarketPriceEUR;
      dayGain += position.getDayGain(true);
    });

    let previousDayMarketPrice = marketPrice - dayGain;
    if (previousDayMarketPrice === 0)
      return 0.0;
    
    return dayGain / previousDayMarketPrice;
  }

    // Loads the specified transactions file
    // sample file: https://raw.githubusercontent.com/lionelschiepers/MyStock/master/MyStockWeb/Data/1.csv
    async Load (url) 
     {
        const result = [];

        await axios
          .get(url)
          .then(res => {
            const parsedCsv = parser(res.data, {columns:true});

            parsedCsv.forEach(data =>
            {
              data.Shares = Math.abs(parseFloat(data.Shares));
              data.Price = parseFloat(data.Price);
              data.Commission = parseFloat(data.Commission);
              
              let item = result.find(o => o.Ticker === data.Symbol);
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

      const tickers = result.filter(o=>o.NumberOfShares > 0).map(o=> o.Ticker);

      let yahooData = await new YahooFinanceLoader().Load(tickers, [YahooFinanceFields.RegularMarketPrice, YahooFinanceFields.RegularMarketPreviousClose]);
      result.forEach(o => o.Security = yahooData.find(y => y.symbol === o.Ticker));

      result.forEach(position =>
        {
          position.MarketCostEUR  = position.RateToEUR * position.MarketCost;
          position.PastGainEUR  = position.RateToEUR * position.PastGain;

          if (position.Security == null)
            return;
          if (position.Security.regularMarketPrice == null)
            return;

          position.MarketPrice = position.Security.regularMarketPrice * position.NumberOfShares;
          position.MarketPriceEUR = position.RateToEUR * position.MarketPrice;          
        });
        
        return result;
    }
}