use std::cmp::PartialEq;
use std::env;
use rocket::{get, post};
use rocket::serde::{Deserialize, json::Json};
use diesel::prelude::*;
use serde::Serialize;

use crate::database;
use crate::models::user::User;
use crate::schema::users::dsl::{id as id_col, display_name as display_name_col, users as users_dsl};
use crate::schema::users;
use crate::models::challenge::Challenge;
use crate::schema::challenges::dsl::{id as challenge_id_col, user_id, challenges as challenges_dsl};
use crate::schema::challenges;

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct PreAuthResponse {
    code: String,
}

#[get("/preauth")]
pub fn preauth() -> Json<PreAuthResponse> {
    let code = uuid::Uuid::new_v4().to_string();

    let connection = &mut database::establish_connection();
    let challenge = Challenge{
        id: code.clone(),
        user_id: None
    };
    diesel::insert_into(challenges::table)
        .values::<Challenge>(challenge.clone().into())
        .execute(connection)
        .expect("Error creating challenge for preauth");

    Json(PreAuthResponse{code})
}

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
struct AuthenticationRequest {
    public_key: String,
    user: User
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct AuthenticationResponse {
    error: Option<String>,
    user: Option<User>
}

#[post("/authenticate/<code>", format="application/json", data="<request>")]
pub fn authenticate(code: String, request: Json<AuthenticationRequest>) -> Json<AuthenticationResponse> {
    let connection = &mut database::establish_connection();
    let res = challenges_dsl.filter(challenge_id_col.eq(code.clone())).first::<Challenge>(connection);
    let challenge = match res {
        Ok(c) => c,
        Err(_) => {
            return Json(AuthenticationResponse{error: Some("Invalid code".to_string()), user: None});
        }
    };

    let res = users_dsl.filter(id_col.eq(request.public_key.clone())).first(connection);
    let user = match res {
        Ok(user) => user,
        Err(err) => {
            println!("error finding user: {}", err);
            let id = code.clone();
            let display_name = request.user.clone().display_name;
            let user = User{id, display_name};
            match diesel::insert_into(users::table)
                .values::<User>(user.clone().into())
                .execute(connection) {
                Ok(_) => user,
                Err(err) => {
                    println!("error creating user: {}", err);
                    return Json(AuthenticationResponse{error: Some("Error creating user".to_string()), user: None})
                }
            }
        }
    };

    let res = match diesel::update(challenges_dsl.filter(challenge_id_col.eq(challenge.id)))
        .set(user_id.eq(user.clone().id))
        .execute(connection) {
        Ok(_) => AuthenticationResponse{error: None, user: Some(user.clone())},
        Err(_) => AuthenticationResponse{error: Some("Error updating challenge".to_string()), user: None}
    };

    if res.error != None {
        return Json(res);
    }

    match diesel::update(users_dsl.filter((id_col.eq(user.clone().id))))
        .set(display_name_col.eq(user.clone().display_name))
        .execute(connection) {
        Ok(_) => Json(AuthenticationResponse{error: None, user: Some(user.clone())}),
        Err(_) => Json(AuthenticationResponse{error: Some("Error updating user".to_string()), user: None})
    }
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct AuthenticatedResponse {
    error: Option<String>,
    user: Option<User>
}
#[get("/authenticated/<code>")]
pub fn authenticated(code: String) -> Json<AuthenticatedResponse> {
    let connection = &mut database::establish_connection();
    let res = challenges_dsl.filter(challenge_id_col.eq(code.clone())).first::<Challenge>(connection);
    let challenge = match res {
        Ok(c) => c,
        Err(_) => {
            return Json(AuthenticatedResponse{error: Some("Invalid code".to_string()), user: None});
        }
    };

    match challenge.user_id {
        Some(uid) => {
            match users_dsl.filter(id_col.eq(uid)).first::<User>(connection) {
                Ok(user) => Json(AuthenticatedResponse{error: None, user: Some(user)}),
                Err(_) => Json(AuthenticatedResponse{error: Some("Invalid user".to_string()), user: None})
            }
        },
        None => Json(AuthenticatedResponse{error: None, user: None})
    }
}