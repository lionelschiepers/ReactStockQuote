import React, {Component} from 'react';
import {Column, Table, SortDirection, AutoSizer} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import _ from 'lodash';
// import {YahooFinanceLoader, YahooFinanceFields} from './YahooFinanceLoader';
import { Portfolio } from './Portfolio';

/*
const list = [
  {name: 'Xavier', description: 'T'},
  {name: 'Lionel', description: 'B'},
  {name: 'Fabrice', description: 'E'},
];
*/

class YahooFinance extends Component {
    constructor(props) {
        super(props);

        this.state = {
          // yahooData : {},
          portfolio : [], //this._internalSort(list, 'name', SortDirection.ASC),
          sortBy: 'Name',
          sortDirection: SortDirection.ASC,
        }

        this._sort = this._sort.bind(this); 
        // this.renderPrice = this.renderPrice.bind(this);

        // let loader = new YahooFinanceLoader();
        // loader.Load(['AAPL', 'MSFT'], [YahooFinanceFields.RegularMarketPrice]);

        // let portfolio = new Portfolio();
        // portfolio.Load('https://raw.githubusercontent.com/lionelschiepers/MyStock/master/MyStockWeb/Data/1.csv');
      }

      componentDidMount() {
        /*
        let loader = new YahooFinanceLoader();
        loader
          .Load(['AAPL'], [YahooFinanceFields.RegularMarketPrice])
          .then(result => 
            this.setState({yahooData : result}));
*/
        let portfolioBuilder = new Portfolio();
        portfolioBuilder
          .Load('https://raw.githubusercontent.com/lionelschiepers/MyStock/master/MyStockWeb/Data/1.csv')
          .then(portfolio => this.setState({portfolio:portfolio}) );
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
            portfolio
          } = this.state;

          let orderedList = this._internalSort(portfolio, sortBy, sortDirection);
          this.setState( {portfolio: orderedList, sortBy:sortBy, sortDirection:sortDirection} );
      }

      renderPrice({
        cellData,
        columnData,
        columnIndex,
        dataKey,
        isScrolling,
        rowData,
        rowIndex
      })
      {
        /*
        if (dataKey === 'Security.regularMarketPrice')
        {
          return (<div>{rowData.Security == null || rowData.Security.regularMarketPrice == null ? '': rowData.Security.regularMarketPrice.toFixed(2)} {rowData.Currency}</div>);
        }
        */

        if (dataKey === 'NumberOfShares')
          return (<div>{cellData == null ? '': cellData.toFixed(0)}</div>);

        let postData = '';
        if (dataKey === 'Security.regularMarketPrice' && cellData != null)
          postData = rowData.Currency;
        
        return (<div>{cellData == null ? '': cellData.toFixed(2)} {postData}</div>);
      }
    
    render() {
        const {
            portfolio,
            // yahooData,
            sortBy,
            sortDirection,
          } = this.state;

          /*
        let json = '';
        try {
          if (_.isArray(portfolio))
            json = JSON.stringify(yahooData[0].regularMarketPrice);

        } catch(error) {
            json = 'error';
        }
         */
        return (
<div>
   <div>Apple data:{/*json*/}</div>
  <div>
  <AutoSizer>
    {({height, width}) => (
    <Table
      width={width}
      height={1000}
      headerHeight={20}
      rowHeight={30}
      sort={this._sort}
      sortBy={sortBy}
      sortDirection={sortDirection}
      rowCount={this.state.portfolio.length}
      rowGetter={({index}) => this.state.portfolio[index]}>
        <Column align={'left'} width={300} label="Name" dataKey="Name" disableSort={false} />
        <Column width={100} label="Price" dataKey="Security.regularMarketPrice" disableSort={false} cellDataGetter={({rowData}) => rowData.Security == null ? null : rowData.Security.regularMarketPrice} cellRenderer={this.renderPrice} />
        <Column width={100} label="Shares" dataKey="NumberOfShares" disableSort={false} cellRenderer={this.renderPrice} />
        <Column width={150} label="Market Cost" dataKey="MarketCost" disableSort={false} cellRenderer={this.renderPrice} />
        <Column width={150} label="Market Price" dataKey="MarketPrice" disableSort={false} cellRenderer={this.renderPrice} />
        <Column width={150} label="Gain" disableSort={false} cellDataGetter={({rowData}) => rowData.MarketPrice - rowData.MarketCost} cellRenderer={this.renderPrice} />
        <Column width={150} label="Past Gain" dataKey="PastGain" disableSort={false} cellRenderer={this.renderPrice} />
    </Table>
    )}
    </AutoSizer>,
  </div>
</div>
        );
    }
}

export default YahooFinance;