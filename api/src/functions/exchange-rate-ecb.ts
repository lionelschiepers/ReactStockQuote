import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";

export async function exchangeRateEcb(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>  {
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
        "Content-Type": responseContentType,
        "Cache-Control": "max-age=86400"
      }
    };
  } catch (e) {
    return {
      status: e.response.status,
      body: e.response.statusText,
    };

    context.error(e);
  }
};

app.http('exchange-rate-ecb', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: exchangeRateEcb
});
