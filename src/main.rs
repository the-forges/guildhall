use std::env;
use rocket::{routes};
use rocket::fs::FileServer;

mod api;
mod database;
mod models;
mod schema;

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    let _ = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    rocket::build()
        .mount("/api", routes![api::authentication::preauth, api::authentication::authenticate, api::authentication::authenticated])
        .mount("/", FileServer::from("./static"))
        .launch()
        .await?;
    Ok(())
}
