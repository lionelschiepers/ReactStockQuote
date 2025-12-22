docker build -t lionelschiepers/stockquote-react:latest -f .\Dockerfile .
docker push lionelschiepers/stockquote-react:latest

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock nickfedor/watchtower --cleanup --run-once
