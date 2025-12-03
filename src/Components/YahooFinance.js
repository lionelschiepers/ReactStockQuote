import { Component } from "react";
import { Column, Table, SortDirection, AutoSizer } from "react-virtualized";
import { withAuth0 } from "@auth0/auth0-react";
import "react-virtualized/styles.css"; // only needs to be imported once
import _ from "lodash";
import { Portfolio } from "./Portfolio";
import "./YahooFinance.css";

import { CSVLink /*, CSVDownload*/ } from "react-csv";

class YahooFinance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      portfolio: [],
      marketCost: 0,
      marketPrice: 0,
      pastGain: 0,
      gain: 0,
      dayDiff: 0,
      dividendYield: 0,
      dividendRate: 0,
      sortBy: "Name",
      sortDirection: SortDirection.ASC,
      displayInEUR: false,
    };

    this._sort = this._sort.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.renderPrice = this.renderPrice.bind(this);
  }

  componentDidMount() {
    const { isAuthenticated, user } = this.props.auth0;
    if (!isAuthenticated) return;

    let portfolioUri =
      "https://raw.githubusercontent.com/lionelschiepers/MyStock/master/MyStockWeb/Data/" +
      encodeURIComponent(user.email) +
      ".csv";

    Portfolio.Load(portfolioUri).then((portfolio) => {
      this.setState({ portfolio: portfolio });

      let marketCost = 0;
      let marketPrice = 0;
      let pastGain = 0;
      portfolio.forEach((position) => {
        pastGain += position.PastGainEUR;

        if (Number.isNaN(position.MarketCostEUR)) return;
        if (Number.isNaN(position.MarketPriceEUR)) return;

        marketCost += position.MarketCostEUR;
        marketPrice += position.MarketPriceEUR;
      });

      let gain = marketCost === 0 ? 0 : marketPrice / marketCost - 1.0;
      let dayDiff = Portfolio.getDayDiff(portfolio);
      let dividendYield = Portfolio.getDividendRatio(portfolio);
      let dividendRate = Portfolio.getDividendRate(portfolio);

      this.setState({
        marketCost: marketCost,
        marketPrice: marketPrice,
        gain: gain,
        pastGain: pastGain,
        dayDiff: dayDiff,
        dividendYield: dividendYield,
        dividendRate: dividendRate,
      });
    });
  }

  _internalSort(list, sortBy, sortDirection) {
    let orderedList = _.sortBy(list, (p) => {
      if (sortBy === "Diff") {
        let diff = p.getDayDiff();
        if (p.NumberOfShares === 0) diff = null;

        if (diff == null && sortDirection === SortDirection.DESC)
          diff = -100000000; // always at the bottom

        return diff;
      }

      if (sortBy === "GainPercent") {
        let diff = p.getGainDiff();
        if (p.NumberOfShares === 0) diff = null;

        if (diff == null && sortDirection === SortDirection.DESC)
          diff = -100000000; // always at the bottom

        return diff;
      }

      if (_.isString(p[sortBy])) return p[sortBy].toLowerCase(); // case insensitive sort.

      return p[sortBy];
    });

    if (sortDirection === SortDirection.DESC)
      orderedList = orderedList.reverse();

    return orderedList;
  }

  _sort({ sortBy, sortDirection }) {
    const { portfolio } = this.state;

    let orderedList = this._internalSort(portfolio, sortBy, sortDirection);
    this.setState({
      portfolio: orderedList,
      sortBy: sortBy,
      sortDirection: sortDirection,
    });
  }

  renderPrice({
    cellData,
    columnData,
    columnIndex,
    dataKey,
    isScrolling,
    rowData,
    rowIndex,
  }) {
    let postData = "";

    if (dataKey === "Security.regularMarketPrice" && rowData.Security != null) {
      if (cellData != null) postData = rowData.Currency;
    }

    if (dataKey === "NumberOfShares")
      return <div>{cellData == null ? "" : cellData.toFixed(0)}</div>;

    if (dataKey === "Diff") {
      let price =
        rowData.Security == null ? null : rowData.Security.regularMarketPrice;
      let previousPrice =
        rowData.Security == null
          ? null
          : rowData.Security.regularMarketPreviousClose;
      if (price == null || previousPrice == null) return <div />;

      cellData = 100.0 * (price / previousPrice - 1.0);
      postData = "%";
    }

    if (dataKey === "GainPercent") {
      postData = "%";
    }

    if (dataKey === "MarketCost" && this.state.displayInEUR)
      cellData = rowData.MarketCostEUR;
    if (dataKey === "MarketPrice" && this.state.displayInEUR)
      cellData = rowData.MarketPriceEUR;
    if (dataKey === "PastGain" && this.state.displayInEUR)
      cellData = rowData.PastGainEUR;

    if (
      (dataKey === "MarketCost" || dataKey === "MarketPrice") &&
      cellData === 0
    )
      cellData = null;

    return (
      <div>
        {cellData == null ? "" : cellData.toFixed(2)} {postData}
      </div>
    );
  }

  renderName({
    cellData,
    columnData,
    columnIndex,
    dataKey,
    isScrolling,
    rowData,
    rowIndex,
  }) {
    return (
      <a
        className="stockName"
        target="_blank"
        rel="noopener noreferrer"
        href={"https://finance.yahoo.com/quote/" + rowData.Ticker}
      >
        {rowData.Name}
      </a>
    );
  }

  handleCheck() {
    this.setState({ displayInEUR: !this.state.displayInEUR });
    this.forceUpdate();
  }

  render() {
    const { portfolio, sortBy, sortDirection } = this.state;

    return (
      <div>
        <div style={{ textAlign: "left" }}>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td>
                  Market Price:{" "}
                  {this.state.marketPrice.toLocaleString("fr-BE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                  <br />
                  Market Cost:{" "}
                  {this.state.marketCost.toLocaleString("fr-BE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                  <br />
                  Total Gain: {(this.state.gain * 100.0).toFixed(2)}%
                  <br />
                  Day diff: {(this.state.dayDiff * 100.0).toFixed(2)}%
                  <br />
                  Past Gain:{" "}
                  {this.state.pastGain.toLocaleString("fr-BE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                  <br />
                  Dividend Yield: {this.state.dividendYield.toFixed(2)}% (
                  {this.state.dividendRate.toLocaleString("fr-BE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                  )
                </td>
                <td style={{ textAlign: "right", verticalAlign: "top" }}>
                  <CSVLink data={this.state.portfolio}>Download data</CSVLink>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
        </div>
        <div style={{ textAlign: "left" }}>
          <input
            type="checkbox"
            onChange={this.handleCheck}
            defaultChecked={this.state.displayInEUR}
          />{" "}
          Display in EUR
        </div>
        <div>
          <AutoSizer disableHeight>
            {({ height, width }) => (
              <Table
                width={width}
                height={9000}
                headerHeight={20}
                rowHeight={30}
                rowClassName={({ index }) => {
                  if (index !== -1 && index % 2 === 0) {
                    return "evenRow";
                  } else if (index !== -1 && index % 2 === 1) {
                    return "oddRow";
                  }
                }}
                sort={this._sort}
                sortBy={sortBy}
                sortDirection={sortDirection}
                rowCount={portfolio.length}
                rowGetter={({ index }) => portfolio[index]}
              >
                <Column
                  className="stockName"
                  width={300}
                  label="Name"
                  dataKey="Name"
                  disableSort={false}
                  cellRenderer={this.renderName}
                />
                <Column
                  width={100}
                  label="Price"
                  dataKey="Security.regularMarketPrice"
                  disableSort={false}
                  cellDataGetter={({ rowData }) =>
                    rowData.Security == null
                      ? null
                      : rowData.Security.regularMarketPrice
                  }
                  cellRenderer={this.renderPrice}
                />
                <Column
                  width={100}
                  label="Diff"
                  dataKey="Diff"
                  disableSort={false}
                  cellDataGetter={({ rowData }) => rowData.getDayDiff()}
                  cellRenderer={this.renderPrice}
                />
                <Column
                  width={100}
                  label="Shares"
                  dataKey="NumberOfShares"
                  disableSort={false}
                  cellRenderer={this.renderPrice}
                />
                <Column
                  width={150}
                  label="Market Cost"
                  dataKey="MarketCost"
                  disableSort={false}
                  cellRenderer={this.renderPrice}
                />
                <Column
                  width={150}
                  label="Market Price"
                  dataKey="MarketPrice"
                  disableSort={false}
                  cellRenderer={this.renderPrice}
                />
                <Column
                  width={150}
                  label="Gain"
                  dataKey="Gain"
                  disableSort={false}
                  cellDataGetter={({ rowData }) =>
                    rowData.getGain(this.state.displayInEUR)
                  }
                  cellRenderer={this.renderPrice}
                />
                <Column
                  width={150}
                  label="Gain %"
                  dataKey="GainPercent"
                  disableSort={false}
                  cellDataGetter={({ rowData }) => rowData.getGainDiff()}
                  cellRenderer={this.renderPrice}
                />
                <Column
                  width={150}
                  label="Past Gain"
                  dataKey="PastGain"
                  disableSort={false}
                  cellRenderer={this.renderPrice}
                />
              </Table>
            )}
          </AutoSizer>
          ,
        </div>
      </div>
    );
  }
}

export default withAuth0(YahooFinance);
