import axios from 'axios';
import _ from 'lodash';

// const anyCorsHttp = axios.create();

function getUrl(quotes, fields) {
  if (!_.isArray(quotes)) quotes = [quotes];

  let url = process.env.REACT_APP_YAHOO_URL + "?symbols=" + _.join(quotes, ",");
  if (fields == null) return url;

  return url + "&fields=" + _.join(fields, ",");
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
    Symbol : 'symbol',
    /*
    Tradeable,
    */
    TrailingAnnualDividendRate : 'trailingAnnualDividendRate',
    TrailingAnnualDividendYield : 'trailingAnnualDividendYield',
    /*
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
    const ttl = 300 * 1000;
  
    const now = Date.now();
    
    let result = [];

    for(let i = symbols.length - 1; i >= 0; i--)
    {
      let symbol = symbols[i];
      let cacheItem = localStorage.getItem(symbol);
      if (cacheItem != null)
      {
        cacheItem = JSON.parse(cacheItem);
        if ((now - cacheItem.Date) < ttl) // 5 minutes
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
    let urls= [];
    chunks.forEach((item, index, array) => {
      let url = getUrl(chunks[index], fields);
      urls.push(axios.get(url));
    });

    // fetch all urls in parallel.
    await axios.all(urls).then(
      axios.spread((...responses) => {
        responses.forEach((response) => {
          let chunkData = response.data;

          chunkData.forEach((o) => {
            o.Date = now;
            localStorage.setItem(o.symbol, JSON.stringify(o));
            result.push(o);
          });
        });
      })
    );

    return result;
  }
}
