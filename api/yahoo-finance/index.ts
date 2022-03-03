import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> 
{
    context.log('HTTP trigger YahooFinance launched');

    try
    {
        // sample url https://query1.finance.yahoo.com/v7/finance/quote?symbols=UNA.AS&fields=regularMarketPrice,regularMarketPreviousClose,trailingAnnualDividendRate

        const queryString = Object.keys(req.query).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(req.query[key])).join('&');
        const baseUrl = 'https://query1.finance.yahoo.com/v7/finance/quote';
        const requestUrl = baseUrl + '?' + queryString;

        const response = await axios.get<string>(requestUrl);

        const responseMessage = response.data;
        const responseContentType = response.headers["content-type"];
    
        context.res = {
            status: response.status,
            body: responseMessage,
            headers: {
                'Content-Type': responseContentType
            }
        };
    }
    catch(e)
    {
        context.res = 
        {
            status: e.response.status,
            body: e.response.statusText
        };
    }
};

export default httpTrigger;