import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";

export async function yahooFinance(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("HTTP trigger YahooFinance launched");

  try {
    // sample url https://query1.finance.yahoo.com/v7/finance/quote?symbols=UNA.AS&fields=regularMarketPrice,regularMarketPreviousClose,trailingAnnualDividendRate

    const queryString = Object.keys(request.query)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(request.query[key])
      )
      .join("&");
    const baseUrl = "https://query1.finance.yahoo.com/v6/finance/quote";
    const requestUrl = baseUrl + "?" + queryString;

    // https://blog.logrocket.com/async-await-in-typescript/
    const response = await axios.get<string>(requestUrl);

    const responseMessage = response.data;
    const responseContentType = response.headers["content-type"];

    return {
      status: response.status,
      body: responseMessage,
      headers: {
        "Content-Type": responseContentType
      },
    };
  } catch (e) {
    return {
      status: e.response.status,
      body: e.response.statusText,
    };

    context.error(e);
  }
};

app.http('yahoo-finance', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: yahooFinance
});
