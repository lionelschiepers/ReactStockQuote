import React, {Component} from 'react';
import axios from 'axios';
import {Column, Table, SortDirection} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import underscore from 'underscore';

const list = [
  {name: 'Xavier', description: 'T'},
  {name: 'Lionel', description: 'B'},
  {name: 'Fabrice', description: 'E'},
];

const anyCorsHttp = axios.create(
  { baseURL:'https://cors-anywhere.herokuapp.com' }
);

const yahooFinanceUrl = 'https://query1.finance.yahoo.com/v7/finance/quote';

function getUrl(quote)
{
    return yahooFinanceUrl + '?symbols=' + quote;
}

class YahooFinanceLoader
{
  Load(symbols)
  {
    let result = [];
    let chunks = underscore.chunks(symbols, 20);
    chunks.forEach(chunk => 
      {
        anyCorsHttp
            .get('/' + getUrl(chunk[0]))
            .then(json => {
                this.setState({
                    yahooData : json.data
                    })
                });
        result.push();
      });

  }
}

class YahooFinance extends Component {
    constructor(props) {
        super(props);

        this.state = {
          yahooData : {},
          list : this._internalSort(list, 'name', SortDirection.ASC),
          sortBy: 'name',
          sortDirection: SortDirection.ASC,
        }

        this._sort = this._sort.bind(this); 

        YahooFinanceLoader loader = new YahooFinanceLoader();
        loader.Load(['AAPL']);
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

      _internalSort(list, sortBy, sortDirection)
      {
        let orderedList = underscore.sortBy(list, p => p[sortBy]);
        if (sortDirection === SortDirection.DESC)
          orderedList = orderedList.reverse();

          return orderedList;
      }

      _sort({sortBy, sortDirection}) {
        const {
            list
          } = this.state;

          let orderedList = this._internalSort(list, sortBy, sortDirection);
          this.setState( {list: orderedList, sortBy:sortBy, sortDirection:sortDirection} );
      }
    
    render() {
        const {
            yahooData,
            sortBy,
            sortDirection,
          } = this.state;

        let json = '';
        try {
            json = JSON.stringify(yahooData.quoteResponse.result[0].regularMarketPrice);

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
    sortBy={sortBy}
    sortDirection={sortDirection}
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