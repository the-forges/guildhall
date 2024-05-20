import './Menu.css';

function Menu({ leading, title, trailing }) {
    let user = localStorage.getItem("user");
    if (user) {
        user = JSON.parse(user)
    }

    return (
        <div className="menu">
            <div className="leading">{leading}</div>
            <h1 className="title">{title}</h1>
            <div className="expanse"></div>
            <div className="trailing">{trailing}</div>
        </div>
    )
}

export default Menu;