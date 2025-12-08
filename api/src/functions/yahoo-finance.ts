import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

// sample call: http://localhost:7071/api/yahoo-finance?symbols=MSFT&fields=regularMarketPrice
export async function yahooFinanceHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("HTTP trigger YahooFinance launched");

  try {
    // sample url https://query1.finance.yahoo.com/v7/finance/quote?symbols=UNA.AS&fields=regularMarketPrice,regularMarketPreviousClose,trailingAnnualDividendRate

    const querySymbols = request.query.get("symbols").split(",");
    const queryFields = request.query.get("fields").split(",");
    const results = await yahooFinance.quote(querySymbols, { fields: queryFields });

    const responseMessage = results;

    return {
      jsonBody: responseMessage
    };
  } catch (e) {
    context.error(e);

    return {
      status: e.response.status,
      body: e.response.statusText,
    };
  }
};

app.http('yahoo-finance', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: yahooFinanceHandler
});
