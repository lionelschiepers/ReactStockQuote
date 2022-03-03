import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger YahooFinance launched");

  try {
    // sample url https://query1.finance.yahoo.com/v7/finance/quote?symbols=UNA.AS&fields=regularMarketPrice,regularMarketPreviousClose,trailingAnnualDividendRate

    const queryString = Object.keys(req.query)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(req.query[key])
      )
      .join("&");
    const baseUrl = "https://query1.finance.yahoo.com/v7/finance/quote";
    const requestUrl = baseUrl + "?" + queryString;

    // https://blog.logrocket.com/async-await-in-typescript/
    const response = await axios.get<string>(requestUrl);

    const responseMessage = response.data;
    const responseContentType = response.headers["content-type"];

    context.res = {
      status: response.status,
      body: responseMessage,
      headers: {
        "Content-Type": responseContentType,
//        "Access-Control-Allow-Origin": "*",
//        "Access-Control-Allow-Methods": "GET",
      },
    };

    // code to refactor for production and use application settings
    let origin = req.headers["origin"] || req.headers["Origin"];
    const cors_domains = [
        "https://zealous-pebble-0e123ed03.1.azurestaticapps.net/",
        "http://localhost:3000",
        "http://localhost:7071"
      ];

    if (origin != null && cors_domains.indexOf(origin) >= 0) {
      context.res.headers["Access-Control-Allow-Origin"] = origin;
      context.res.headers["Access-Control-Allow-Methods"] = "GET";
    }
  } catch (e) {
    context.res = {
      status: e.response.status,
      body: e.response.statusText,
    };

    context.log.error(e);
  }
};

export default httpTrigger;
