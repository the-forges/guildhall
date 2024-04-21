use std::env;
use std::error::Error;
use rocket::{routes};
use rocket::http::Method;
use rocket::fs::FileServer;
use rocket_cors::{AllowedHeaders, AllowedOrigins};

mod api;
mod database;
mod models;
mod schema;

#[rocket::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let _ = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let allowed_origins = AllowedOrigins::all();
    let cors = rocket_cors::CorsOptions {
        allowed_origins,
        allowed_methods: vec![Method::Get].into_iter().map(From::from).collect(),
        allowed_headers: AllowedHeaders::some(&["Authorization", "Accept"]),
        allow_credentials: true,
        ..Default::default()
    }
        .to_cors()?;

    rocket::build()
        .mount("/api", routes![
            api::authentication::preauth,
            api::authentication::authenticate,
            api::authentication::authenticated,
        ])
        .mount("/", FileServer::from("./static"))
        .attach(cors)
        .launch()
        .await?;
    Ok(())
}
