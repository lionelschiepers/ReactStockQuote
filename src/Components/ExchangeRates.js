import axios from 'axios';

class Cache
{
    static Rates;
}

// i.e: let rate = await GetRate('USD', 'EUR')
export async function GetRate(from, to)
{
    // const url = 'https://cors-anywhere.herokuapp.com/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
    // webapp doesn't support 'https' in the query string 
    // const url = 'https://stockquote-cors.azurewebsites.net/www.ecb.europa.eu:443/stats/eurofxref/eurofxref-daily.xml';
    const url = process.env.REACT_APP_EXCHANGE_RATES_URL;
    /*
    let url = 'https://zealous-pebble-0e123ed03.1.azurestaticapps.net/api/exchange-rate-ecb';
    if (process.env.NODE_ENV === "development")
        url = 'https://stockquote-cors.azurewebsites.net/www.ecb.europa.eu:443/stats/eurofxref/eurofxref-daily.xml';
        */
    // const url = 'http://localhost/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
    if (Cache.Rates == null)
    {
        await axios
            .get(url)
            .then(res => 
                {
                    let parser=new DOMParser();
                    let doc = parser.parseFromString(res.data, 'text/xml');
                    
                    let nsResolver = doc.createNSResolver(doc.documentElement);
                    
                    let nodes = doc.evaluate("/gesmes:Envelope/*[name()='Cube']/*[name()='Cube']/*[name()='Cube']", doc.documentElement, nsResolver, XPathResult.ANY_TYPE, null);
                    let result = [];
                    let node;
                    while((node = nodes.iterateNext()) != null) 
                    {
                        let currency = node.getAttribute('currency');
                        let rate = node.getAttribute('rate');

                        result.push({ currency:currency.toUpperCase(), rate:parseFloat(rate)});

                        if (currency === 'GBP')
                        {
                            result.push({ currency:'GBp', rate:100.0 * parseFloat(rate)});
                        }
                    }

                    // EUR => EUR
                    result.push({ currency:'EUR', rate:1.0 });

                    Cache.Rates = result;
                }); 
    }

    if (Cache.Rates == null)
        throw new Error(`Failed to load the exchange rates from ${url}`);

    let fromRate = Cache.Rates.find(o =>o.currency === from);
    if (fromRate == null)
        throw new Error (`Failed to retrieve a rate for ${from}`);

    let toRate = Cache.Rates.find(o =>o.currency === to);
    if (toRate == null)
        throw new Error (`Failed to retrieve a rate for ${to}`);

    let rate = (1 / fromRate.rate) * toRate.rate;
    return rate;
}
