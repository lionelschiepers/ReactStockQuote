import React from 'react';
import logo from './logo.svg';
import './App.css';
import YahooFinance from "./Components/YahooFinance";
import axios from 'axios';
/*
const yahooFinanceHttp = axios.create
(
  {
    baseURL:'https://query1.finance.yahoo.com',
    headers: {'X-Requested-With': 'XMLHttpRequest'},
}
);
*/
const yahooFinanceHttp = axios.create
(
  {
    baseURL:'https://cors-anywhere.herokuapp.com'
}
);
/*
const yahooFinanceHttp = axios.create(
  {
    headers: {'X-Requested-With': 'XMLHttpRequest'},
  }
);
*/

function App() {

    var cors_api_url = '/https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL';
 
  /*
  let data2 = yahooFinanceHttp
    .get('/stockApi')
    .then(response => response.data);
*/
  let data = yahooFinanceHttp
    //.get('/v7/finance/quote?symbols=AAPL')
    .get(cors_api_url)
    .then(response => response.data);
  /*console.log(data);
*/
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
