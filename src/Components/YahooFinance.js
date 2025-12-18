import React, { useState, useEffect, useCallback, useMemo } from "react";
import { List } from "react-window";
import { useAuth0 } from "@auth0/auth0-react";
import _ from "lodash";
import { Portfolio } from "./Portfolio";
import { CSVLink } from "react-csv";

const YahooFinance = () => {
  const { isAuthenticated, user } = useAuth0();
  
  const [portfolio, setPortfolio] = useState([]);
  const [marketCost, setMarketCost] = useState(0);
  const [marketPrice, setMarketPrice] = useState(0);
  const [pastGain, setPastGain] = useState(0);
  const [gain, setGain] = useState(0);
  const [dayDiff, setDayDiff] = useState(0);
  const [dividendYield, setDividendYield] = useState(0);
  const [dividendRate, setDividendRate] = useState(0);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [displayInEUR, setDisplayInEUR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load portfolio data when component mounts or user changes
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadPortfolio = async () => {
      setIsLoading(true);
      try {
        const portfolioUri = `https://raw.githubusercontent.com/lionelschiepers/StockQuote.Portfolio/main/Portfolio/${encodeURIComponent(user.email)}.csv`;
        
        const portfolioData = await Portfolio.Load(portfolioUri);
        setPortfolio(portfolioData);

        let totalMarketCost = 0;
        let totalMarketPrice = 0;
        let totalPastGain = 0;
        
        portfolioData.forEach((position) => {
          totalPastGain += position.PastGainEUR;

          if (!Number.isNaN(position.MarketCostEUR)) {
            totalMarketCost += position.MarketCostEUR;
          }
          if (!Number.isNaN(position.MarketPriceEUR)) {
            totalMarketPrice += position.MarketPriceEUR;
          }
        });

        const totalGain = totalMarketCost === 0 ? 0 : totalMarketPrice / totalMarketCost - 1.0;
        const totalDayDiff = Portfolio.getDayDiff(portfolioData);
        const totalDividendYield = Portfolio.getDividendRatio(portfolioData);
        const totalDividendRate = Portfolio.getDividendRate(portfolioData);

        setMarketCost(totalMarketCost);
        setMarketPrice(totalMarketPrice);
        setGain(totalGain);
        setPastGain(totalPastGain);
        setDayDiff(totalDayDiff);
        setDividendYield(totalDividendYield);
        setDividendRate(totalDividendRate);
      } catch (error) {
        console.error('Failed to load portfolio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolio();
  }, [isAuthenticated, user]);

  // Sort functionality
  const internalSort = useCallback((list, sortByField, direction) => {
    let orderedList = _.sortBy(list, (p) => {
      if (sortByField === "Security.regularMarketPrice") {
        return p.Security?.regularMarketPrice || 0;
      }

      if (sortByField === "Diff") {
        let diff = p.getDayDiff();
        if (p.NumberOfShares === 0) diff = null;

        if (diff == null && direction === "DESC") {
          diff = -100000000; // always at the bottom
        }
        return diff;
      }

      if (sortByField === "GainPercent") {
        let diff = p.getGainDiff();
        if (p.NumberOfShares === 0) diff = null;

        if (diff == null && direction === "DESC") {
          diff = -100000000; // always at the bottom
        }
        return diff;
      }

      if (sortByField === "Gain") {
        return p.getGain(displayInEUR);
      }

      if (_.isString(p[sortByField])) {
        return p[sortByField].toLowerCase(); // case insensitive sort
      }
      return p[sortByField];
    });

    if (direction === "DESC") {
      orderedList = orderedList.reverse();
    }
    return orderedList;
  }, [displayInEUR]);

  const handleSort = useCallback(({ sortBy: sortByField, sortDirection: direction }) => {
    const orderedList = internalSort(portfolio, sortByField, direction);
    setPortfolio(orderedList);
    setSortBy(sortByField);
    setSortDirection(direction);
  }, [portfolio, internalSort]);

  // Price rendering function
  const renderPrice = useCallback((cellData, dataKey, rowData) => {
    if (isNaN(cellData)) return <div />;
    let postData = "";

    if (dataKey === "Security.regularMarketPrice" && rowData.Security != null) {
      if (cellData != null) postData = rowData.Currency;
    }

    if (dataKey === "NumberOfShares") {
      return <div>{cellData == null ? "" : cellData.toFixed(0)}</div>;
    }

    if (dataKey === "Diff") {
      let price = rowData.Security == null ? null : rowData.Security.regularMarketPrice;
      let previousPrice = rowData.Security == null ? null : rowData.Security.regularMarketPreviousClose;
      if (price == null || previousPrice == null) return <div />;

      cellData = 100.0 * (price / previousPrice - 1.0);
      postData = "%";
    }

    if (dataKey === "GainPercent") {
      postData = "%";
    }

    if (dataKey === "MarketCost" && displayInEUR) {
      cellData = rowData.MarketCostEUR;
    }
    if (dataKey === "MarketPrice" && displayInEUR) {
      cellData = rowData.MarketPriceEUR;
    }
    if (dataKey === "PastGain" && displayInEUR) {
      cellData = rowData.PastGainEUR;
    }

    if ((dataKey === "MarketCost" || dataKey === "MarketPrice") && cellData === 0) {
      cellData = null;
    }

    return (
      <div>
        {cellData == null ? "" : cellData.toFixed(2)} {postData}
      </div>
    );
  }, [displayInEUR]);

  // Name rendering function
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

  // Toggle EUR display
  const handleCheck = useCallback(() => {
    setDisplayInEUR(prev => !prev);
  }, []);

  // Memoized row component
  const RowComponent = React.memo(({ index, style, portfolio: portfolioProp, displayInEUR: displayEUR }) => {
    if (typeof portfolioProp === 'undefined' || index >= portfolioProp.length) return null;

    const item = portfolioProp[index];

    // Pre-calculate values that depend on displayInEUR to avoid recalculations
    const marketCostValue = displayEUR ? item.MarketCostEUR : item.MarketCost;
    const marketPriceValue = displayEUR ? item.MarketPriceEUR : item.MarketPrice;
    const pastGainValue = displayEUR ? item.PastGainEUR : item.PastGain;
    const gainValue = item.getGain(displayEUR);
    const gainDiffValue = item.getGainDiff();

    return (
      <div style={{ ...(style || {}), display: 'flex' }} className={index % 2 === 0 ? 'evenRow' : 'oddRow'}>
        <div style={{ flex: '0 0 300px', padding: '5px' }}>{renderName(item)}</div>
        <div style={{ flex: '0 0 100px', padding: '5px' }}>
          {renderPrice(item.Security?.regularMarketPrice, 'Security.regularMarketPrice', item)}
        </div>
        <div style={{ flex: '0 0 100px', padding: '5px' }}>
          {renderPrice(item.getDayDiff(), 'Diff', item)}
        </div>
        <div style={{ flex: '0 0 100px', padding: '5px' }}>
          {renderPrice(item.NumberOfShares, 'NumberOfShares', item)}
        </div>
        <div style={{ flex: '0 0 150px', padding: '5px' }}>
          {renderPrice(marketCostValue, 'MarketCost', item)}
        </div>
        <div style={{ flex: '0 0 150px', padding: '5px' }}>
          {renderPrice(marketPriceValue, 'MarketPrice', item)}
        </div>
        <div style={{ flex: '0 0 150px', padding: '5px' }}>
          {renderPrice(gainValue, 'Gain', item)}
        </div>
        <div style={{ flex: '0 0 150px', padding: '5px' }}>
          {renderPrice(gainDiffValue, 'GainPercent', item)}
        </div>
        <div style={{ flex: '0 0 150px', padding: '5px' }}>
          {renderPrice(pastGainValue, 'PastGain', item)}
        </div>
      </div>
    );
  }, (prevProps, nextProps) => {
    // Custom comparison function to prevent unnecessary re-renders
    return (
      prevProps.displayInEUR === nextProps.displayInEUR &&
      prevProps.index === nextProps.index &&
      prevProps.portfolio[prevProps.index] === nextProps.portfolio[nextProps.index] &&
      prevProps.style?.top === nextProps.style?.top
    );
  });

  // Memoized sort indicator
  const getSortIndicator = useCallback((field) => {
    if (sortBy === field && sortDirection === 'ASC') return '↑';
    if (sortBy === field && sortDirection === 'DESC') return '↓';
    return '';
  }, [sortBy, sortDirection]);

  // Create sort handler for each column
  const createSortHandler = useCallback((field) => {
    return () => {
      const newDirection = sortBy === field && sortDirection === 'ASC' ? 'DESC' : 'ASC';
      handleSort({ sortBy: field, sortDirection: newDirection });
    };
  }, [sortBy, sortDirection, handleSort]);

  if (isLoading) {
    return <div>Loading portfolio data...</div>;
  }

  return (
    <div className="yahoo-finance-container">
      <div style={{ textAlign: "left" }}>
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td>
                Market Price:{" "}
                {marketPrice.toLocaleString("fr-BE", {
                  style: "currency",
                  currency: "EUR",
                })}
                <br />
                Market Cost:{" "}
                {marketCost.toLocaleString("fr-BE", {
                  style: "currency",
                  currency: "EUR",
                })}
                <br />
                Total Gain: {(gain * 100.0).toFixed(2)}%
                <br />
                Day diff: {(dayDiff * 100.0).toFixed(2)}%
                <br />
                Past Gain:{" "}
                {pastGain.toLocaleString("fr-BE", {
                  style: "currency",
                  currency: "EUR",
                })}
                <br />
                Dividend Yield: {dividendYield.toFixed(2)}% (
                {dividendRate.toLocaleString("fr-BE", {
                  style: "currency",
                  currency: "EUR",
                })}
                )
              </td>
              <td style={{ textAlign: "right", verticalAlign: "top" }}>
                <CSVLink data={portfolio}>Download data</CSVLink>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
      </div>
      <div style={{ textAlign: "left" }}>
        <input
          type="checkbox"
          onChange={handleCheck}
          checked={displayInEUR}
        />{" "}
        Display in EUR
      </div>
      <div>
        <div style={{ display: 'flex', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>
          <div style={{ flex: '0 0 300px', padding: '5px' }} onClick={createSortHandler('Name')}>
            Name {getSortIndicator('Name')}
          </div>
          <div style={{ flex: '0 0 100px', padding: '5px' }} onClick={createSortHandler('Security.regularMarketPrice')}>
            Price {getSortIndicator('Security.regularMarketPrice')}
          </div>
          <div style={{ flex: '0 0 100px', padding: '5px' }} onClick={createSortHandler('Diff')}>
            Diff {getSortIndicator('Diff')}
          </div>
          <div style={{ flex: '0 0 100px', padding: '5px' }} onClick={createSortHandler('NumberOfShares')}>
            Shares {getSortIndicator('NumberOfShares')}
          </div>
          <div style={{ flex: '0 0 150px', padding: '5px' }} onClick={createSortHandler('MarketCost')}>
            Market Cost {getSortIndicator('MarketCost')}
          </div>
          <div style={{ flex: '0 0 150px', padding: '5px' }} onClick={createSortHandler('MarketPrice')}>
            Market Price {getSortIndicator('MarketPrice')}
          </div>
          <div style={{ flex: '0 0 150px', padding: '5px' }} onClick={createSortHandler('Gain')}>
            Gain {getSortIndicator('Gain')}
          </div>
          <div style={{ flex: '0 0 150px', padding: '5px' }} onClick={createSortHandler('GainPercent')}>
            Gain % {getSortIndicator('GainPercent')}
          </div>
          <div style={{ flex: '0 0 150px', padding: '5px' }} onClick={createSortHandler('PastGain')}>
            Past Gain {getSortIndicator('PastGain')}
          </div>
        </div>
        <List
          className="react-window-list"
          rowComponent={RowComponent}
          rowCount={portfolio.length}
          rowHeight={25}
          height={600}
          rowProps={{ portfolio, displayInEUR }}
        />
      </div>
    </div>
  );
};

export default YahooFinance;
