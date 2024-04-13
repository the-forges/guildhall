FROM rust:latest
LABEL authors="m3talsmith"

EXPOSE 8000

RUN apt-get update && apt-get upgrade -y && apt-get install -y libmariadb-dev-compat libmariadb-dev
WORKDIR /prod
COPY . .
RUN cargo build --release

CMD ["./target/release/guildhall"]