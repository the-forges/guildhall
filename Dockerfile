FROM golang:latest
LABEL authors="m3talsmith"

EXPOSE 8000

RUN apt-get update && apt-get upgrade -y
WORKDIR /prod
COPY . .
RUN APP_NAME=guildhall make build

CMD ["./build/guildhall"]