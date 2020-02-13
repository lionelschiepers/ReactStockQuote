import React, {Component} from 'react';
import axios from 'axios';
import {Column, Table} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import underscore from 'underscore';

// Table data as an array of objects
const list = [
    {name: 'Lionel', description: 'B'},
    {name: 'Fabrice', description: 'E'},
  {name: 'Xavier', description: 'T'},
  // And so on...
];

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
            yahooData : {},
            list : list
        }

        this._sort = this._sort.bind(this);
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

      _sort({sortBy, sortDirection}) {
          const state = this.state;
          const list = underscore.sortBy(state.list, p => p[sortBy]);
          
          this.setState({
            yahooData : state.yahooData,
            list: list
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
            <div><div>Apple data:{json}</div>
            <div><Table
    width={300}
    height={300}
    headerHeight={20}
    rowHeight={30}
    sort={this._sort}
    rowCount={list.length}
    rowGetter={({index}) => this.state.list[index]}>
    <Column label="Name" dataKey="name" width={100} disableSort={false} />
    <Column width={200} label="Description" dataKey="description" disableSort={false} />
  </Table></div>
            </div>
        );
    }
}

export default YahooFinance;