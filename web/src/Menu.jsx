import './Menu.css';

function Menu({ leading, title, trailing }) {
    let user = localStorage.getItem("user");
    if (user) {
        user = JSON.parse(user)
    }

    return (
        <div className='menu'>

            <div className="menu-top">
                <div className="leading">{leading}</div>
                <h1 className="title">{title}</h1>
                <div className="expanse"></div>
                <div className="trailing">{trailing}</div>
            </div>
            <div className='menu-bottom'>
                <a href="/">Home</a>
            </div>
        </div>
    )
}

export default Menu;