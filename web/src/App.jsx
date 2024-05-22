import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Authenticated from './Authenticated';
import Forges from './forges/Forges';
import Menu from './Menu';

function logout() {
  const event = new Event("logout");
  window.dispatchEvent(event);
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Forges />
  }
])

function App() {

  return (
    <Authenticated>
      <Menu
        title='Guildhall'
        trailing={
          <button id='logout' onClick={logout}>Logout</button>
        }>
      </Menu>
      <RouterProvider router={router} />
    </Authenticated>
  );
}

export default App;
