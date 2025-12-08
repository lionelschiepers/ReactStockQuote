docker build -t stockquote-node-api -f .\Dockerfile .
docker tag stockquote-node-api lionelschiepers/stockquote-node-api:latest
docker push lionelschiepers/stockquote-node-api:latest
