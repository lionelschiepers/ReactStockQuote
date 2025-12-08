import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";

export async function exchangeRateEcbHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("HTTP trigger GetExchangeRates launched");

  try {
    const response = await axios.get<string>(
      "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml"
    );
    const responseMessage = response.data;
    const responseContentType = response.headers["content-type"];

    return {
      status: response.status,
      body: responseMessage,
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": responseContentType,
        "Cache-Control": "max-age=86400"
      }
    };
  } catch (e) {
    context.error(e);

    return {
      status: e.response.status,
      body: e.response.statusText,
    };
  }
};

app.http('exchange-rate-ecb', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: exchangeRateEcbHandler
});
