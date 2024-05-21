import './App.css';
import Authenticated from './Authenticated';
import Menu from './Menu';

function logout() {
  const event = new Event("logout");
  window.dispatchEvent(event);
}

function App() {

  return (
    <Authenticated>
      <Menu
        title='Guildhall'
        trailing={
          <button id='logout' onClick={logout}>Logout</button>
        }>
      </Menu>
    </Authenticated>
  );
}

export default App;
