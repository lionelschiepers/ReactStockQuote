import axios from 'axios';
import _ from 'lodash';


const anyCorsHttp = axios.create(
    { baseURL:'https://cors-anywhere.herokuapp.com' }
  );
  
const yahooFinanceUrl = 'https://query1.finance.yahoo.com/v7/finance/quote';
  
  function getUrl(quotes, fields)
  {
    if (!_.isArray(quotes))
      quotes = [quotes];
  
      let url = yahooFinanceUrl + '?symbols=' + _.join(quotes, ',');
      if (fields == null)
        return url;
  
      return url + "&fields=" + _.join(fields, ',');
  }

export const YahooFinanceFields = {
    /*
    Ask : 'ask',
    AskSize,
    AverageDailyVolume10Day,
    AverageDailyVolume3Month,
    Bid,
    BidSize,
    BookValue,
    */
    Currency : 'currency',
    /*
    DividendDate,
    EarningsTimestamp,
    EarningsTimestampEnd,
    EarningsTimestampStart,
    EpsForward,
    EpsTrailingTwelveMonths,
    */
    Exchange : 'exchange',
    /*
    ExchangeDataDelayedBy,
    ExchangeTimezoneName,
    ExchangeTimezoneShortName,
    FiftyDayAverage,
    FiftyDayAverageChange,
    FiftyDayAverageChangePercent,
    FiftyTwoWeekHigh,
    FiftyTwoWeekHighChange,
    FiftyTwoWeekHighChangePercent,
    FiftyTwoWeekLow,
    FiftyTwoWeekLowChange,
    FiftyTwoWeekLowChangePercent,
    FinancialCurrency,
    ForwardPE,
    FullExchangeName,
    GmtOffSetMilliseconds,
    Language,
    LongName,
    */
    Market : 'market',
    /*
    MarketCap,
    MarketState,
    MessageBoardId,
    PriceHint,
    PriceToBook,
    QuoteSourceName,
    QuoteType,
    RegularMarketChange,
    RegularMarketChangePercent,
    RegularMarketDayHigh,
    RegularMarketDayLow,
    */
    RegularMarketOpen : 'regularMarketOpen',
    RegularMarketPreviousClose : 'regularMarketPreviousClose',
    RegularMarketPrice : 'regularMarketPrice',
    /*
    RegularMarketTime,
    RegularMarketVolume,
    PostMarketChange,
    PostMarketChangePercent,
    PostMarketPrice,
    PostMarketTime,
    SharesOutstanding,
    ShortName,
    SourceInterval,
    */
    Symbol,
    /*
    Tradeable,
    TrailingAnnualDividendRate,
    TrailingAnnualDividendYield,
    TrailingPE,
    TwoHundredDayAverage,
    TwoHundredDayAverageChange,
    TwoHundredDayAverageChangePercent
    */
  };

export class YahooFinanceLoader
{ 
  async Load(symbols, fields)
  {
    let now = Date.now();
    
    let result = [];

    for(let i = symbols.length - 1; i >= 0; i--)
    {
      let symbol = symbols[i];
      let cacheItem = localStorage.getItem(symbol);
      if (cacheItem != null)
      {
        cacheItem = JSON.parse(cacheItem);
        if ((now - cacheItem.Date) < 1000 * 60 * 5) // 5 minutes
        {
          result.push(cacheItem);
          symbols.splice(i, 1);
        }
        else
        {
          localStorage.removeItem(symbol);
        }
      }
    }

    let chunks = _.chunk(symbols, 50);
    for (let i =0;i<chunks.length;i++)
    {
        let chunk = chunks[i];
        let chunkData = await anyCorsHttp
            .get('/' + getUrl(chunk, fields))
            .then(json => json.data.quoteResponse.result);
        
        chunkData.forEach(o =>
        {
          o.Date = now;
          localStorage.setItem(o.symbol, JSON.stringify(o));
          result.push(o);
        });
    }

    return result;
  }
}
