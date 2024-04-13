// @generated automatically by Diesel CLI.

diesel::table! {
    challenges (id) {
        #[max_length = 255]
        id -> Varchar,
        #[max_length = 255]
        user_id -> Nullable<Varchar>,
    }
}

diesel::table! {
    users (id) {
        #[max_length = 255]
        id -> Varchar,
        #[max_length = 255]
        display_name -> Nullable<Varchar>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    challenges,
    users,
);
