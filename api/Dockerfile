# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:4-node18-appservice
FROM mcr.microsoft.com/azure-functions/node:4-node22

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

WORKDIR /home/site/wwwroot

# Copy package.json and install packages before copying the rest of the code to enable caching
COPY package.json package.json
RUN npm install

# Copy the rest of the code
COPY . .
RUN  npm run build

#ENV AZURE_FUNCTIONS_ENVIRONMENT=Development
#ENV AzureWebJobsStorage=UseDevelopmentStorage=true
#ENV FUNCTIONS_NODE_BLOCK_ON_ENTRY_POINT_ERROR=true
#COPY . /home/site/wwwroot

#RUN cd /home/site/wwwroot && \
#    npm install && \
#    npm run build