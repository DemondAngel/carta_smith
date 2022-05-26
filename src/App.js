import './App.css';
import CartaSmith from './carta_smith/carta_smith';

function App() {
  return (
    <div className="App">
      <header className="smith-header primary-color p-5 m-0">
          <h1 className="smith-text">Carta de Smith</h1>
          <h2 className="name-text">Ian Rojas Gómez</h2>
      </header>

      <CartaSmith></CartaSmith> 
    </div>
  );
}

export default App;
