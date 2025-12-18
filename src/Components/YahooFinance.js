import { Component, memo, useMemo, useCallback } from "react";
import { List } from "react-window";
import { withAuth0 } from "@auth0/auth0-react";
import _ from "lodash";
import { Portfolio } from "./Portfolio";
import { CSVLink } from "react-csv";


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
      sortBy: null,
      sortDirection: null,
      displayInEUR: false,
    };

    this._sort = this._sort.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.renderPrice = this.renderPrice.bind(this);
    this.renderName = this.renderName.bind(this);
    this.RowComponent = this.RowComponent.bind(this);
  }

  componentDidMount() {
    const { isAuthenticated, user } = this.props.auth0;
    if (!isAuthenticated) return;

    let portfolioUri =
      "https://raw.githubusercontent.com/lionelschiepers/StockQuote.Portfolio/main/Portfolio/" +
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
      if (sortBy === "Security.regularMarketPrice") {
        return p.Security?.regularMarketPrice || 0;
      }

      if (sortBy === "Diff") {
        let diff = p.getDayDiff();
        if (p.NumberOfShares === 0) diff = null;

        if (diff == null && sortDirection === "DESC")
          diff = -100000000; // always at the bottom

        return diff;
      }

      if (sortBy === "GainPercent") {
        let diff = p.getGainDiff();
        if (p.NumberOfShares === 0) diff = null;

        if (diff == null && sortDirection === "DESC")
          diff = -100000000; // always at the bottom

        return diff;
      }

      if (sortBy === "Gain") {
        return p.getGain(this.state.displayInEUR);
      }

      if (_.isString(p[sortBy])) return p[sortBy].toLowerCase(); // case insensitive sort.

      return p[sortBy];
    });

    if (sortDirection === "DESC")
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

  renderPrice(cellData, dataKey, rowData) {
    if (isNaN(cellData)) return <div />;
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

  handleCheck() {
    this.setState({ displayInEUR: !this.state.displayInEUR });
  }

  renderName(rowData) {
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

  RowComponent({
    index,
    portfolio,
    style
  }) {
    {
      if (typeof portfolio === 'undefined')
        return null;

      const item = portfolio[index];
      return (
        <div style={{ ...(style || {}), display: 'flex' }} className={index % 2 === 0 ? 'evenRow' : 'oddRow'}>
          <div style={{ flex: '0 0 300px', padding: '5px' }}>{this.renderName(item, index)}</div>
          <div style={{ flex: '0 0 100px', padding: '5px' }}>{this.renderPrice(item.Security?.regularMarketPrice, 'Security.regularMarketPrice', item, index)}</div>
          <div style={{ flex: '0 0 100px', padding: '5px' }}>{this.renderPrice(item.getDayDiff(), 'Diff', item, index)}</div>
          <div style={{ flex: '0 0 100px', padding: '5px' }}>{this.renderPrice(item.NumberOfShares, 'NumberOfShares', item, index)}</div>
          <div style={{ flex: '0 0 150px', padding: '5px' }}>{this.renderPrice(item.MarketCost, 'MarketCost', item, index)}</div>
          <div style={{ flex: '0 0 150px', padding: '5px' }}>{this.renderPrice(item.MarketPrice, 'MarketPrice', item, index)}</div>
          <div style={{ flex: '0 0 150px', padding: '5px' }}>{this.renderPrice(item.getGain(this.state.displayInEUR), 'Gain', item, index)}</div>
          <div style={{ flex: '0 0 150px', padding: '5px' }}>{this.renderPrice(item.getGainDiff(), 'GainPercent', item, index)}</div>
          <div style={{ flex: '0 0 150px', padding: '5px' }}>{this.renderPrice(item.PastGain, 'PastGain', item, index)}</div>
        </div>
      );
    }
  }

  render() {
    const { portfolio } = this.state;

    return (
      <div className="yahoo-finance-container">
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
            checked={this.state.displayInEUR}
          />{" "}
          Display in EUR
        </div>
        <div>
          <div style={{ display: 'flex', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>
            <div style={{ flex: '0 0 300px', padding: '5px' }} onClick={() => this._sort({ sortBy: 'Name', sortDirection: this.state.sortBy === 'Name' && this.state.sortDirection === 'ASC' ? 'DESC' : 'ASC' })}>
              Name {this.state.sortBy === 'Name' && this.state.sortDirection === 'ASC' ? '↑' : this.state.sortBy === 'Name' && this.state.sortDirection === 'DESC' ? '↓' : ''}
            </div>
            <div style={{ flex: '0 0 100px', padding: '5px' }} onClick={() => this._sort({ sortBy: 'Security.regularMarketPrice', sortDirection: this.state.sortBy === 'Security.regularMarketPrice' && this.state.sortDirection === 'ASC' ? 'DESC' : 'ASC' })}>
              Price {this.state.sortBy === 'Security.regularMarketPrice' && this.state.sortDirection === 'ASC' ? '↑' : this.state.sortBy === 'Security.regularMarketPrice' && this.state.sortDirection === 'DESC' ? '↓' : ''}
            </div>
            <div style={{ flex: '0 0 100px', padding: '5px' }} onClick={() => this._sort({ sortBy: 'Diff', sortDirection: this.state.sortBy === 'Diff' && this.state.sortDirection === 'ASC' ? 'DESC' : 'ASC' })}>
              Diff {this.state.sortBy === 'Diff' && this.state.sortDirection === 'ASC' ? '↑' : this.state.sortBy === 'Diff' && this.state.sortDirection === 'DESC' ? '↓' : ''}
            </div>
            <div style={{ flex: '0 0 100px', padding: '5px' }} onClick={() => this._sort({ sortBy: 'NumberOfShares', sortDirection: this.state.sortBy === 'NumberOfShares' && this.state.sortDirection === 'ASC' ? 'DESC' : 'ASC' })}>
              Shares {this.state.sortBy === 'NumberOfShares' && this.state.sortDirection === 'ASC' ? '↑' : this.state.sortBy === 'NumberOfShares' && this.state.sortDirection === 'DESC' ? '↓' : ''}
            </div>
            <div style={{ flex: '0 0 150px', padding: '5px' }} onClick={() => this._sort({ sortBy: 'MarketCost', sortDirection: this.state.sortBy === 'MarketCost' && this.state.sortDirection === 'ASC' ? 'DESC' : 'ASC' })}>
              Market Cost {this.state.sortBy === 'MarketCost' && this.state.sortDirection === 'ASC' ? '↑' : this.state.sortBy === 'MarketCost' && this.state.sortDirection === 'DESC' ? '↓' : ''}
            </div>
            <div style={{ flex: '0 0 150px', padding: '5px' }} onClick={() => this._sort({ sortBy: 'MarketPrice', sortDirection: this.state.sortBy === 'MarketPrice' && this.state.sortDirection === 'ASC' ? 'DESC' : 'ASC' })}>
              Market Price {this.state.sortBy === 'MarketPrice' && this.state.sortDirection === 'ASC' ? '↑' : this.state.sortBy === 'MarketPrice' && this.state.sortDirection === 'DESC' ? '↓' : ''}
            </div>
            <div style={{ flex: '0 0 150px', padding: '5px' }} onClick={() => this._sort({ sortBy: 'Gain', sortDirection: this.state.sortBy === 'Gain' && this.state.sortDirection === 'ASC' ? 'DESC' : 'ASC' })}>
              Gain {this.state.sortBy === 'Gain' && this.state.sortDirection === 'ASC' ? '↑' : this.state.sortBy === 'Gain' && this.state.sortDirection === 'DESC' ? '↓' : ''}
            </div>
            <div style={{ flex: '0 0 150px', padding: '5px' }} onClick={() => this._sort({ sortBy: 'GainPercent', sortDirection: this.state.sortBy === 'GainPercent' && this.state.sortDirection === 'ASC' ? 'DESC' : 'ASC' })}>
              Gain % {this.state.sortBy === 'GainPercent' && this.state.sortDirection === 'ASC' ? '↑' : this.state.sortBy === 'GainPercent' && this.state.sortDirection === 'DESC' ? '↓' : ''}
            </div>
            <div style={{ flex: '0 0 150px', padding: '5px' }} onClick={() => this._sort({ sortBy: 'PastGain', sortDirection: this.state.sortBy === 'PastGain' && this.state.sortDirection === 'ASC' ? 'DESC' : 'ASC' })}>
              Past Gain {this.state.sortBy === 'PastGain' && this.state.sortDirection === 'ASC' ? '↑' : this.state.sortBy === 'PastGain' && this.state.sortDirection === 'DESC' ? '↓' : ''}
            </div>
          </div>
          <List
            className="react-window-list"
            rowComponent={MemoizedRowComponent}
            rowCount={this.state.portfolio.length}
            rowHeight={25}
            height={600}
            rowProps={ { portfolio: this.state.portfolio, displayInEUR: this.state.displayInEUR } }
          />
        </div>
      </div>
    );
  }
}

// Optimized RowComponent with memoization and performance improvements
const MemoizedRowComponent = memo(({ index, portfolio, style, displayInEUR }) => {
  if (typeof portfolio === 'undefined' || index >= portfolio.length) return null;

  const item = portfolio[index];

  // Cache the item reference to prevent unnecessary recalculations
  const cachedItem = useMemo(() => item, [item]);

  // Optimized renderPrice function with early returns and reduced calculations
  const renderPrice = useCallback((cellData, dataKey, rowData) => {
    // Early exit for invalid data
    if (isNaN(cellData) || rowData == null) return <div />;

    let postData = "";
    let finalValue = cellData;

    // Handle different data types with minimal branching
    switch (dataKey) {
      case "Security.regularMarketPrice":
        if (rowData.Security != null && cellData != null) {
          postData = rowData.Currency;
        }
        break;

      case "NumberOfShares":
        return <div>{cellData == null ? "" : cellData.toFixed(0)}</div>;

      case "Diff":
        if (rowData.Security != null) {
          const price = rowData.Security.regularMarketPrice;
          const previousPrice = rowData.Security.regularMarketPreviousClose;
          if (price != null && previousPrice != null) {
            finalValue = 100.0 * (price / previousPrice - 1.0);
            postData = "%";
          } else {
            return <div />;
          }
        }
        break;

      case "GainPercent":
        postData = "%";
        break;

      case "MarketCost":
      case "MarketPrice":
      case "PastGain":
        if (displayInEUR) {
          finalValue = rowData[`${dataKey}EUR`];
        }
        break;
    }

    // Handle zero values
    if ((dataKey === "MarketCost" || dataKey === "MarketPrice") && finalValue === 0) {
      finalValue = null;
    }

    // Format the final value
    return (
      <div>
        {finalValue == null ? "" : finalValue.toFixed(2)} {postData}
      </div>
    );
  }, [displayInEUR]);

  // Simple renderName function
  const renderName = useCallback((rowData) => {
    return (
      <a
        className="stockName"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://finance.yahoo.com/quote/${rowData.Ticker}`}
      >
        {rowData.Name}
      </a>
    );
  }, []);

  // Pre-calculate values that depend on displayInEUR to avoid recalculations
  const marketCostValue = displayInEUR ? cachedItem.MarketCostEUR : cachedItem.MarketCost;
  const marketPriceValue = displayInEUR ? cachedItem.MarketPriceEUR : cachedItem.MarketPrice;
  const pastGainValue = displayInEUR ? cachedItem.PastGainEUR : cachedItem.PastGain;
  const gainValue = cachedItem.getGain(displayInEUR);
  const gainDiffValue = cachedItem.getGainDiff();

  return useMemo(() => (
    <div style={{ ...(style || {}), display: 'flex' }} className={index % 2 === 0 ? 'evenRow' : 'oddRow'}>
      <div style={{ flex: '0 0 300px', padding: '5px' }}>{renderName(cachedItem)}</div>
      <div style={{ flex: '0 0 100px', padding: '5px' }}>{renderPrice(cachedItem.Security?.regularMarketPrice, 'Security.regularMarketPrice', cachedItem)}</div>
      <div style={{ flex: '0 0 100px', padding: '5px' }}>{renderPrice(cachedItem.getDayDiff(), 'Diff', cachedItem)}</div>
      <div style={{ flex: '0 0 100px', padding: '5px' }}>{renderPrice(cachedItem.NumberOfShares, 'NumberOfShares', cachedItem)}</div>
      <div style={{ flex: '0 0 150px', padding: '5px' }}>{renderPrice(marketCostValue, 'MarketCost', cachedItem)}</div>
      <div style={{ flex: '0 0 150px', padding: '5px' }}>{renderPrice(marketPriceValue, 'MarketPrice', cachedItem)}</div>
      <div style={{ flex: '0 0 150px', padding: '5px' }}>{renderPrice(gainValue, 'Gain', cachedItem)}</div>
      <div style={{ flex: '0 0 150px', padding: '5px' }}>{renderPrice(gainDiffValue, 'GainPercent', cachedItem)}</div>
      <div style={{ flex: '0 0 150px', padding: '5px' }}>{renderPrice(pastGainValue, 'PastGain', cachedItem)}</div>
    </div>
  ), [index, style, displayInEUR, cachedItem, renderPrice, renderName, marketCostValue, marketPriceValue, pastGainValue, gainValue, gainDiffValue]);
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  // Only re-render if displayInEUR changes or the specific item changes
  return (
    prevProps.displayInEUR === nextProps.displayInEUR &&
    prevProps.index === nextProps.index &&
    prevProps.portfolio[prevProps.index] === nextProps.portfolio[nextProps.index] &&
    prevProps.style?.top === nextProps.style?.top
  );
});

export default withAuth0(YahooFinance);
