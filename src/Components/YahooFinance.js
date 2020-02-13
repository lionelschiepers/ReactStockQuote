import React, {Component} from 'react';
import axios from 'axios';

const anyCorsHttp = axios.create(
  { baseURL:'https://cors-anywhere.herokuapp.com' }
);

const yahooFinanceUrl = 'https://query1.finance.yahoo.com/v7/finance/quote';

function getUrl(quote)
{
    return yahooFinanceUrl + '?symbols=' + quote;
}

class YahooFinance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yahooData : {}
        }
      }

      componentDidMount() {
        anyCorsHttp
            .get('/' + getUrl('AAPL'))
            .then(json => {
                this.setState({
                    yahooData : json.data
                    })
                });
      }
    
    render() {
        const state = this.state;
        let json = '';
        try {
            json = JSON.stringify(state.yahooData.quoteResponse.result[0].regularMarketPrice);

        } catch(error) {
            json = 'error';
        }
        return (
            <div>Apple data:{json}</div>
        );
    }
}

export default YahooFinance;