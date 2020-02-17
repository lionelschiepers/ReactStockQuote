import React, {Component} from 'react';
import {Column, Table, SortDirection} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import _ from 'lodash';
import {YahooFinanceLoader, YahooFinanceFields} from './YahooFinanceLoader';
import { Portfolio } from './Portfolio';

const list = [
  {name: 'Xavier', description: 'T'},
  {name: 'Lionel', description: 'B'},
  {name: 'Fabrice', description: 'E'},
];

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

        let loader = new YahooFinanceLoader();
        loader.Load(['AAPL', 'MSFT'], [YahooFinanceFields.RegularMarketPrice]);

        let portfolio = new Portfolio();
        portfolio.Load('https://raw.githubusercontent.com/lionelschiepers/MyStock/master/MyStockWeb/Data/1.csv');
      }

      componentDidMount() {
        let loader = new YahooFinanceLoader();
        loader
          .Load(['AAPL'], [YahooFinanceFields.RegularMarketPrice])
          .then(result => 
            this.setState({yahooData : result}));
      }

      _internalSort(list, sortBy, sortDirection)
      {
        let orderedList = _.sortBy(list, p => p[sortBy]);
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
          if (_.isArray(yahooData))
            json = JSON.stringify(yahooData[0].regularMarketPrice);

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