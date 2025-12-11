@REM docker build -t lionelschiepers/repo:latest .
docker build -t lionelschiepers/stockquote-react:latest -f .\Dockerfile .
@REM docker tag stockquote-react lionelschiepers/stockquote-react:latest
docker push lionelschiepers/stockquote-react:latest

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock nickfedor/watchtower --cleanup --run-once

@REM docker-compose -f docker-compose.prod.yml build

@REM docker login docker.io
@REM docker tag app-prod lionelschiepers/repo:latest

@REM docker images

@REM docker run -p 80:80 --name react-app app-prod

@REM docker tag lionelschiepers/repo:latest stockquote.azurecr.io/stockquote:latest
@REM docker tag app-prod stockquote.azurecr.io/stockquote:latest
@REM az acr login -n stockquote
@REM docker push stockquote.azurecr.io/stockquote:latest
@REM docker rmi stockquote.azurecr.io/stockquote:latest

@REM az group create --name "rg-container" --location "West Europe"
@REM az acr create --resource-group rg-container --name stockquote --sku Basic --admin-enabled true

@REM az container delete --resource-group rg-container --name container-stockquote
@REM az container create --resource-group rg-container --name container-stockquote --image stockquote.azurecr.io/stockquote:latest --dns-name-label stockquote --ports 80