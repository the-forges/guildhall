use diesel::Insertable;
use diesel::prelude::Queryable;
use rocket::serde::{Serialize, Deserialize};
use crate::schema::users;

#[derive(Serialize, Deserialize, Insertable, Queryable, Clone, PartialEq)]
#[serde(crate = "rocket::serde")]
#[diesel(table_name = users)]
pub struct User {
    pub id: String,
    pub display_name: Option<String>,
}