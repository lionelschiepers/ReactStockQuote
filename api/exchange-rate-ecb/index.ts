import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> 
{
    context.log('HTTP trigger GetExchangeRates launched');
    try
    {
        const response = await axios.get<string>("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml");
        const responseMessage = response.data;
        const responseContentType = response.headers["content-type"];

        context.res = 
        {
            status: response.status,
            body: responseMessage,
            headers: 
            {
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

        context.log.error(e);
    }
};

export default httpTrigger;