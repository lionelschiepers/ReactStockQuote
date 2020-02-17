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
    Ask : 'ask',
    /*
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
    Symbol,
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
  Load = async (symbols, fields) =>
  {
    let result = [];
    let chunks = _.chunk(symbols, 20);
    for (let i =0;i<chunks.length;i++)
    {
        let chunk = chunks[i];
        let chunkData = await anyCorsHttp
            .get('/' + getUrl(chunk, fields))
            .then(json => json.data.quoteResponse.result);
        
        result.push(...chunkData);
    }

    return result;
  }
}
