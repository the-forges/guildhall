use rocket::{get, routes};
use rocket::fs::FileServer;

#[get("/")]
fn hello() -> String {
    "Hello, world!".to_string()
}

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    rocket::build()
        .mount("/hello", routes![hello])
        .mount("/", FileServer::from("./static"))
        .launch()
        .await?;
    Ok(())
}
