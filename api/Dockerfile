# exposed on NAS with port 20002
# sample url: 
#   /api/yahoo-finance?symbols=MSFT&fields=regularMarketPrice
#   /api/exchange-rate-ecb

# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:4-node22-appservice
FROM mcr.microsoft.com/azure-functions/node:4-node24

RUN apt-get update
RUN apt-get upgrade -y

ENV AzureWebJobsScriptRoot=/home/site/wwwroot
ENV AzureFunctionsJobHost__Logging__Console__IsEnabled=true
# doesn't work as expected for an unknown reason, so added headers in the function code directly
# ENV CORS_ALLOWED_ORIGINS="[\"*\"]" 

WORKDIR /home/site/wwwroot

# copy both package.json and package-lock.json to leverage layer cache & reproducible installs
COPY package*.json ./

# prefer npm ci when a lockfile exists (faster, deterministic)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
# RUN npm audit fix

# Copy the rest of the code
COPY . .
RUN  npm run build

EXPOSE 80