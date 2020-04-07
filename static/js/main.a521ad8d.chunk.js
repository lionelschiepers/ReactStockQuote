(this["webpackJsonpmy-stock-quote"]=this["webpackJsonpmy-stock-quote"]||[]).push([[0],{127:function(e,t,r){e.exports=r(251)},132:function(e,t,r){},133:function(e,t,r){},218:function(e,t){},220:function(e,t){},247:function(e,t,r){},251:function(e,t,r){"use strict";r.r(t);var a=r(0),n=r.n(a),i=r(24),c=r.n(i),l=(r(132),r(133),r(16)),s=r(25),u=r(38),o=r(125),h=r(126),d=r(9),f=(r(194),r(17)),y=r.n(f),k=r(14),m=r.n(k),v=r(30),b=r(123),E=r.n(b),p=r(37),S=r.n(p),g=function e(){Object(l.a)(this,e)};function R(e,t){return P.apply(this,arguments)}function P(){return(P=Object(v.a)(m.a.mark((function e(t,r){var a,n,i,c;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a="https://cors-anywhere.herokuapp.com/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml",null!=g.Rates){e.next=4;break}return e.next=4,S.a.get(a).then((function(e){for(var t,r=(new DOMParser).parseFromString(e.data,"text/xml"),a=r.createNSResolver(r.documentElement),n=r.evaluate("/gesmes:Envelope/*[name()='Cube']/*[name()='Cube']/*[name()='Cube']",r.documentElement,a,XPathResult.ANY_TYPE,null),i=[];null!=(t=n.iterateNext());){var c=t.getAttribute("currency"),l=t.getAttribute("rate");i.push({currency:c.toUpperCase(),rate:parseFloat(l)}),"GBP"===c&&i.push({currency:"GBp",rate:100*parseFloat(l)})}i.push({currency:"EUR",rate:1}),g.Rates=i}));case 4:if(null!=g.Rates){e.next=6;break}throw new Error("Failed to load the exchange rates from ".concat(a));case 6:if(null!=(n=g.Rates.find((function(e){return e.currency===t})))){e.next=9;break}throw new Error("Failed to retrieve a rate for ".concat(t));case 9:if(null!=(i=g.Rates.find((function(e){return e.currency===r})))){e.next=12;break}throw new Error("Failed to retrieve a rate for ".concat(r));case 12:return c=1/n.rate*i.rate,e.abrupt("return",c);case 14:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var D=S.a.create({baseURL:"https://cors-anywhere.herokuapp.com"});function w(e,t){y.a.isArray(e)||(e=[e]);var r="https://query1.finance.yahoo.com/v7/finance/quote?symbols="+y.a.join(e,",");return null==t?r:r+"&fields="+y.a.join(t,",")}var C="regularMarketPreviousClose",M="regularMarketPrice",U="trailingAnnualDividendRate",x=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,[{key:"Load",value:function(){var e=Object(v.a)(m.a.mark((function e(t,r){var a,n,i,c,l,s,u,o;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(a=Date.now(),n=[],i=t.length-1;i>=0;i--)c=t[i],null!=(l=localStorage.getItem(c))&&(l=JSON.parse(l),a-l.Date<3e5?(n.push(l),t.splice(i,1)):localStorage.removeItem(c));s=y.a.chunk(t,50),u=0;case 5:if(!(u<s.length)){e.next=14;break}return o=s[u],e.next=9,D.get("/"+w(o,r)).then((function(e){return e.data.quoteResponse.result}));case 9:e.sent.forEach((function(e){e.Date=a,localStorage.setItem(e.symbol,JSON.stringify(e)),n.push(e)}));case 11:u++,e.next=5;break;case 14:return e.abrupt("return",n);case 15:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}()}]),e}(),N=function(){function e(){Object(l.a)(this,e),this.NumberOfShares=0,this.MarketCost=0,this.MarketCostEUR=0,this.MarketPrice=0,this.MarketPriceEUR=0,this.Transactions=[],this.PastGain=0,this.PastGainEUR=0,this.RateToEUR=1}return Object(s.a)(e,[{key:"getTaxeRate",value:function(){return this.Ticker.indexOf(".")<0?.595:this.Ticker.endsWith(".BR")?.7:this.Ticker.endsWith(".VX")?.65*.7:this.Ticker.endsWith(".ST")?.7*.7:this.Ticker.endsWith(".DE")?.7362*.7:this.Ticker.endsWith(".CA")?.75*.7:this.Ticker.endsWith(".HE")?.8*.7:this.Ticker.endsWith(".LU")||this.Ticker.endsWith(".AS")?.595:this.Ticker.endsWith(".PA")?.872*.7:(this.Ticker.endsWith(".L"),.7)}},{key:"getDividendYield",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=null==this.Security?0:this.Security.trailingAnnualDividendRate;return t*=this.NumberOfShares,Number.isNaN(t)?0:(t*=this.getTaxeRate(),!1===e?t:t*this.RateToEUR)}},{key:"getGain",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return null==this.MarketPrice||null==this.MarketCost||0===this.NumberOfShares?null:e?this.MarketPriceEUR-this.MarketCostEUR:this.MarketPrice-this.MarketCost}},{key:"getGainDiff",value:function(){return null==this.MarketPrice||null==this.MarketCost||0===this.NumberOfShares?0:100*this.MarketPrice/this.MarketCost-100}},{key:"getDayGain",value:function(e){var t=null==this.Security?null:this.Security.regularMarketPrice,r=null==this.Security?null:this.Security.regularMarketPreviousClose;if(null==t||null==r)return 0;var a=(t-r)*this.NumberOfShares;return!1===e?a:a*this.RateToEUR}},{key:"getDayDiff",value:function(){var e=null==this.Security?null:this.Security.regularMarketPrice,t=null==this.Security?null:this.Security.regularMarketPreviousClose;return null==e||null==t?null:100*(e/t-1)}}]),e}(),O=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,null,[{key:"updateCurrency",value:function(){var e=Object(v.a)(m.a.mark((function e(t){var r,a;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=0;case 1:if(!(r<t.length)){e.next=10;break}return(a=t[r]).Ticker.indexOf(".")<0?a.Currency="USD":a.Ticker.endsWith(".SW")?a.Currency="CHF":a.Ticker.endsWith(".L")?a.Currency="GBp":a.Ticker.endsWith(".OL")?a.Currency="NOK":a.Currency="EUR",e.next=6,R(a.Currency,"EUR");case 6:a.RateToEUR=e.sent;case 7:r++,e.next=1;break;case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}]),e}(),G=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,[{key:"Load",value:function(){var e=Object(v.a)(m.a.mark((function e(t){var r,a,n;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=[],e.next=3,S.a.get(t).then((function(e){E()(e.data,{columns:!0}).forEach((function(e){e.Shares=Math.abs(parseFloat(e.Shares)),e.Price=parseFloat(e.Price),e.Commission=parseFloat(e.Commission);var t=r.find((function(t){return t.Ticker===e.Symbol}));switch(null==t&&((t=new N).Ticker=e.Symbol,t.Name=e.Name,r.push(t)),e.Type.toLowerCase()){case"buy":t.NumberOfShares+=e.Shares,t.MarketCost+=e.Shares*e.Price+e.Commission,t.Transactions.push(e);break;case"sell":for(;e.Shares>0;){var a=y.a.last(t.Transactions),n=Math.min(a.Shares,e.Shares);t.MarketCost-=n*a.Price+a.Commission,t.NumberOfShares-=n,a.Shares-=n,e.Shares-=n,t.PastGain+=n*(e.Price-a.Price),0===a.Shares&&t.Transactions.pop()}break;case"deposit cash":t.PastGain+=e.Commission}}))}));case 3:return e.next=5,O.updateCurrency(r);case 5:return a=r.filter((function(e){return e.NumberOfShares>0})).map((function(e){return e.Ticker})),e.next=8,(new x).Load(a,[M,C,U]);case 8:return n=e.sent,r.forEach((function(e){return e.Security=n.find((function(t){return t.symbol===e.Ticker}))})),r.forEach((function(e){e.MarketCostEUR=e.RateToEUR*e.MarketCost,e.PastGainEUR=e.RateToEUR*e.PastGain,null!=e.Security&&null!=e.Security.regularMarketPrice&&(e.MarketPrice=e.Security.regularMarketPrice*e.NumberOfShares,e.MarketPriceEUR=e.RateToEUR*e.MarketPrice)})),e.abrupt("return",r);case 12:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}],[{key:"getDividendRatio",value:function(e){var t=0,r=0;return e.filter((function(e){return e.NumberOfShares>0})).forEach((function(e){t+=e.MarketPriceEUR,r+=e.getDividendYield(!0)})),100*r/t}},{key:"getDividendRate",value:function(e){var t=0;return e.filter((function(e){return e.NumberOfShares>0})).forEach((function(e){return t+=e.getDividendYield(!0)})),t}},{key:"getDayDiff",value:function(e){var t=0,r=0;e.filter((function(e){return e.NumberOfShares>0})).forEach((function(e){t+=e.MarketPriceEUR,r+=e.getDayGain(!0)}));var a=t-r;return 0===a?0:r/a}}]),e}(),T=(r(247),r(124)),j=function(e){Object(h.a)(r,e);var t=Object(o.a)(r);function r(e){var a;return Object(l.a)(this,r),(a=t.call(this,e)).state={portfolio:[],marketCost:0,marketPrice:0,pastGain:0,gain:0,dayDiff:0,dividendYield:0,dividendRate:0,sortBy:"Name",sortDirection:d.c.ASC,displayInEUR:!1},a._sort=a._sort.bind(Object(u.a)(a)),a.handleCheck=a.handleCheck.bind(Object(u.a)(a)),a.renderPrice=a.renderPrice.bind(Object(u.a)(a)),a}return Object(s.a)(r,[{key:"componentDidMount",value:function(){var e=this;(new G).Load("https://raw.githubusercontent.com/lionelschiepers/MyStock/master/MyStockWeb/Data/1.csv").then((function(t){e.setState({portfolio:t});var r=0,a=0,n=0;t.forEach((function(e){n+=e.PastGainEUR,Number.isNaN(e.MarketCostEUR)||Number.isNaN(e.MarketPriceEUR)||(r+=e.MarketCostEUR,a+=e.MarketPriceEUR)}));var i=0===r?0:a/r-1,c=G.getDayDiff(t),l=G.getDividendRatio(t),s=G.getDividendRate(t);e.setState({marketCost:r,marketPrice:a,gain:i,pastGain:n,dayDiff:c,dividendYield:l,dividendRate:s})}))}},{key:"_internalSort",value:function(e,t,r){var a=y.a.sortBy(e,(function(e){if("Diff"===t){var a=e.getDayDiff();return 0===e.NumberOfShares&&(a=null),null==a&&r===d.c.DESC&&(a=-1e8),a}if("GainPercent"===t){var n=e.getGainDiff();return 0===e.NumberOfShares&&(n=null),null==n&&r===d.c.DESC&&(n=-1e8),n}return y.a.isString(e[t])?e[t].toLowerCase():e[t]}));return r===d.c.DESC&&(a=a.reverse()),a}},{key:"_sort",value:function(e){var t=e.sortBy,r=e.sortDirection,a=this.state.portfolio,n=this._internalSort(a,t,r);this.setState({portfolio:n,sortBy:t,sortDirection:r})}},{key:"renderPrice",value:function(e){var t=e.cellData,r=(e.columnData,e.columnIndex,e.dataKey),a=(e.isScrolling,e.rowData),i=(e.rowIndex,"");if("Security.regularMarketPrice"===r&&null!=a.Security&&null!=t&&(i=a.Currency),"NumberOfShares"===r)return n.a.createElement("div",null,null==t?"":t.toFixed(0));if("Diff"===r){var c=null==a.Security?null:a.Security.regularMarketPrice,l=null==a.Security?null:a.Security.regularMarketPreviousClose;if(null==c||null==l)return n.a.createElement("div",null);t=100*(c/l-1),i="%"}return"GainPercent"===r&&(i="%"),"MarketCost"===r&&this.state.displayInEUR&&(t=a.MarketCostEUR),"MarketPrice"===r&&this.state.displayInEUR&&(t=a.MarketPriceEUR),"PastGain"===r&&this.state.displayInEUR&&(t=a.PastGainEUR),"MarketCost"!==r&&"MarketPrice"!==r||0!==t||(t=null),n.a.createElement("div",null,null==t?"":t.toFixed(2)," ",i)}},{key:"renderName",value:function(e){e.cellData,e.columnData,e.columnIndex,e.dataKey,e.isScrolling;var t=e.rowData;e.rowIndex;return n.a.createElement("a",{className:"stockName",target:"_blank",rel:"noopener noreferrer",href:"https://finance.yahoo.com/quote/"+t.Ticker},t.Name)}},{key:"handleCheck",value:function(){this.setState({displayInEUR:!this.state.displayInEUR}),this.forceUpdate()}},{key:"render",value:function(){var e=this,t=this.state,r=t.portfolio,a=t.sortBy,i=t.sortDirection;return n.a.createElement("div",null,n.a.createElement("div",{style:{textAlign:"left"}},n.a.createElement("table",{style:{width:"100%"}},n.a.createElement("tbody",null,n.a.createElement("tr",null,n.a.createElement("td",null,"Market Price: ",this.state.marketPrice.toLocaleString("fr-BE",{style:"currency",currency:"EUR"}),n.a.createElement("br",null),"Market Cost: ",this.state.marketCost.toLocaleString("fr-BE",{style:"currency",currency:"EUR"}),n.a.createElement("br",null),"Total Gain: ",(100*this.state.gain).toFixed(2),"%",n.a.createElement("br",null),"Day diff: ",(100*this.state.dayDiff).toFixed(2),"%",n.a.createElement("br",null),"Past Gain: ",this.state.pastGain.toLocaleString("fr-BE",{style:"currency",currency:"EUR"}),n.a.createElement("br",null),"Dividend Yield: ",this.state.dividendYield.toFixed(2),"% (",this.state.dividendRate.toLocaleString("fr-BE",{style:"currency",currency:"EUR"}),")"),n.a.createElement("td",{style:{textAlign:"right",verticalAlign:"top"}},n.a.createElement(T.CSVLink,{data:this.state.portfolio},"Download data"))))),n.a.createElement("br",null)),n.a.createElement("div",{style:{textAlign:"left"}},n.a.createElement("input",{type:"checkbox",onChange:this.handleCheck,defaultChecked:this.state.displayInEUR})," Display in EUR"),n.a.createElement("div",null,n.a.createElement(d.a,null,(function(t){t.height;var c=t.width;return n.a.createElement(d.d,{width:c,height:1e3,headerHeight:20,rowHeight:30,rowClassName:function(e){var t=e.index;return-1!==t&&t%2===0?"evenRow":-1!==t&&t%2===1?"oddRow":void 0},sort:e._sort,sortBy:a,sortDirection:i,rowCount:r.length,rowGetter:function(e){var t=e.index;return r[t]}},n.a.createElement(d.b,{className:"stockName",width:300,label:"Name",dataKey:"Name",disableSort:!1,cellRenderer:e.renderName}),n.a.createElement(d.b,{width:100,label:"Price",dataKey:"Security.regularMarketPrice",disableSort:!1,cellDataGetter:function(e){var t=e.rowData;return null==t.Security?null:t.Security.regularMarketPrice},cellRenderer:e.renderPrice}),n.a.createElement(d.b,{width:100,label:"Diff",dataKey:"Diff",disableSort:!1,cellDataGetter:function(e){return e.rowData.getDayDiff()},cellRenderer:e.renderPrice}),n.a.createElement(d.b,{width:100,label:"Shares",dataKey:"NumberOfShares",disableSort:!1,cellRenderer:e.renderPrice}),n.a.createElement(d.b,{width:150,label:"Market Cost",dataKey:"MarketCost",disableSort:!1,cellRenderer:e.renderPrice}),n.a.createElement(d.b,{width:150,label:"Market Price",dataKey:"MarketPrice",disableSort:!1,cellRenderer:e.renderPrice}),n.a.createElement(d.b,{width:150,label:"Gain",dataKey:"Gain",disableSort:!1,cellDataGetter:function(t){return t.rowData.getGain(e.state.displayInEUR)},cellRenderer:e.renderPrice}),n.a.createElement(d.b,{width:150,label:"Gain %",dataKey:"GainPercent",disableSort:!1,cellDataGetter:function(e){return e.rowData.getGainDiff()},cellRenderer:e.renderPrice}),n.a.createElement(d.b,{width:150,label:"Past Gain",dataKey:"PastGain",disableSort:!1,cellRenderer:e.renderPrice}))})),","))}}]),r}(a.Component);var W=function(){return n.a.createElement("div",{className:"App"},n.a.createElement(j,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(n.a.createElement(W,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[127,1,2]]]);
//# sourceMappingURL=main.a521ad8d.chunk.js.map