REM docker build -t lionelschiepers/repo:latest .

docker-compose -f docker-compose.prod.yml build

docker login docker.io
docker tag app-prod lionelschiepers/repo:latest

docker images

docker run -p 80:80 --name react-app app-prod


docker tag lionelschiepers/repo:latest stockquote.azurecr.io/stockquote:latest
docker push stockquote.azurecr.io/stockquote:latest
docker rmi stockquote.azurecr.io/stockquote:latest


az group create --name "rg-container" --location "West Europe"
az acr create --resource-group rg-container --name stockquote --sku Basic --admin-enabled true

az container create --resource-group rg-container --name container-stockquote --image stockquote.azurecr.io/stockquote:latest --dns-name-label stockquote --ports 80
