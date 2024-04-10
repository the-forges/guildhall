FROM rust:latest
LABEL authors="m3talsmith"

EXPOSE 8000

WORKDIR /prod
COPY . .
RUN cargo build --release

CMD ["./target/release/guildhall"]