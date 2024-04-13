use diesel::Insertable;
use diesel::prelude::Queryable;
use rocket::serde::{Serialize, Deserialize};
use crate::schema::challenges;

#[derive(Serialize, Deserialize, Insertable, Queryable, Clone)]
#[serde(crate = "rocket::serde")]
#[diesel(table_name = challenges)]
pub struct Challenge {
    pub id: String,
    pub user_id: Option<String>,
}