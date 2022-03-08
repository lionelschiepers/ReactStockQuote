import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";

var reactPlugin = new ReactPlugin();
var appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: process.env.REACT_APP_INSTRUMENTATION_KEY,
    enableAutoRouteTracking: true,
    extensions: [reactPlugin],
  },
});
appInsights.loadAppInsights();

export { reactPlugin, appInsights };
