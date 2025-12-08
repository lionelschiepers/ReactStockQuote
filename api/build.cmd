docker build -t stockquote-node-api -f .\Dockerfile .
docker tag stockquote-node-api lionelschiepers/stockquote-node-api:latest
docker push lionelschiepers/stockquote-node-api:latest

# automatically update the docker container using watchtower
# sudo docker run -d --name=watchtower -v /var/run/docker.sock:/var/run/docker.sock --restart=always -e WATCHTOWER_POLL_INTERVAL=3600 nickfedor/watchtower --cleanup
# sudo docker run --rm -v /var/run/docker.sock:/var/run/docker.sock nickfedor/watchtower --cleanup --run-once
