---
name: stock-news
description: This skill should be used when users need to retrieve real-time stock market news, stock quotes, financial market updates, or any information related to stock trading and investment news. It provides access to multiple Chinese and international financial news sources and stock data APIs.
license: MIT
---

# Stock News Skill

This skill provides comprehensive capabilities for retrieving real-time stock market news, financial data, and investment information from various Chinese and international sources.

## Purpose

Enable real-time access to stock market news, quotes, and financial updates for Chinese and international markets through RSS feeds, financial APIs, and web scraping techniques.

## When to Use This Skill

Use this skill when:
- User requests stock market news or financial updates
- User asks for real-time stock quotes or market data
- User needs information about specific stocks or sectors
- User requests market analysis or investment news
- User wants to track multiple stocks or indices
- User asks for A-share, Hong Kong, or US market information

## Core Capabilities

### 1. Real-Time Stock News Aggregation
Access real-time news from major Chinese and international financial sources:
- **Chinese Sources**: 
  - 东方财富网 (Eastmoney)
  - 新浪财经 (Sina Finance)
  - 同花顺 (10jqka)
  - 网易财经 (Netease Finance)
  - 金融界 (JRJ)
  - 中国证券报 (CS News)
  
- **International Sources**:
  - Reuters
  - Bloomberg
  - CNBC
  - MarketWatch

### 2. Stock Quote Retrieval
Get real-time and delayed stock data for:
- A-shares (Shanghai/Shenzhen)
- Hong Kong stocks
- US stocks
- Indices (Shanghai Composite, Shenzhen Component, Hang Seng, S&P 500, etc.)

### 3. Market Data APIs
Use bundled scripts to access financial data:
- `scripts/fetch_stock_quotes.py` - Get stock quotes from multiple APIs
- `scripts/fetch_stock_news.py` - Aggregate news from RSS feeds
- `scripts/get_market_summary.py` - Get market overview and indices

### 4. News Categorization
Organize news by categories:
- Market News (大盘新闻)
- Individual Stocks (个股资讯)
- Industry/Sector (行业资讯)
- Policy (政策解读)
- International (国际财经)
- Analyst Reports (研报分析)

## How to Use This Skill

### Fetching Stock News

To retrieve stock news, execute the news fetching script:

```bash
python3 scripts/fetch_stock_news.py --source eastmoney --limit 20
```

The script supports the following parameters:
- `--source`: News source (eastmoney, sina, 10jqka, netease, jrj, csnews)
- `--limit`: Number of news items to fetch (default: 20)
- `--category`: News category (general, market, stock, industry, policy, international)
- `--output`: Output file path (optional, defaults to stdout)

### Getting Stock Quotes

To retrieve stock quotes for specific stocks:

```bash
python3 scripts/fetch_stock_quotes.py --symbols 000001,600036,00700 --market cn,hk
```

Parameters:
- `--symbols`: Stock codes (comma-separated)
- `--market`: Market type (cn, hk, us)
- `--fields`: Data fields to retrieve (price, change, percent, volume, turnover, high, low)

### Market Summary

To get overall market overview:

```bash
python3 scripts/get_market_summary.py --market cn
```

This returns:
- Major indices (上证指数, 深证成指, 沪深300, etc.)
- Market sentiment (涨跌家数, 成交量)
- Top gainers and losers
- Sector performance

## Working with Bundled Resources

### Scripts Directory

The `scripts/` directory contains executable Python scripts for:

1. **fetch_stock_news.py**
   - Fetches news from RSS feeds
   - Supports multiple Chinese financial websites
   - Outputs structured JSON data
   - Includes error handling and retries

2. **fetch_stock_quotes.py**
   - Retrieves stock quotes from multiple APIs
   - Supports A-shares, HK, and US stocks
   - Provides real-time and delayed data
   - Formats output for easy consumption

3. **get_market_summary.py**
   - Aggregates market overview data
   - Calculates market statistics
   - Identifies hot sectors and stocks
   - Generates summary report

### References Directory

The `references/` directory contains:

1. **stock_codes.md**: Comprehensive list of Chinese stock codes and company names
2. **market_terminology.md**: Glossary of financial terms and market terminology
3. **api_documentation.md**: Documentation for financial APIs used by the skill
4. **rss_sources.md**: List of available RSS feeds and their structures

### Assets Directory

The `assets/` directory contains:

1. **frontend/**: Ready-to-use web interface templates
2. **config/**: Configuration files for different environments
3. **templates/**: Report templates for market analysis

## Best Practices

### Rate Limiting
- Respect API rate limits
- Implement caching where possible
- Use appropriate intervals for data refresh

### Data Quality
- Cross-reference multiple sources
- Validate data before presenting
- Handle missing or corrupted data gracefully

### User Experience
- Provide clear, actionable information
- Explain market movements in simple terms
- Highlight important news and alerts

### Error Handling
- Always include try-catch blocks
- Provide fallback options when APIs fail
- Log errors for debugging

## Common Workflows

### Workflow 1: Daily Market Summary
1. Run `get_market_summary.py` for A-shares
2. Run `fetch_stock_news.py` for top market news
3. Combine and present to user
4. Highlight major market movers and news drivers

### Workflow 2: Individual Stock Analysis
1. Get stock quote using `fetch_stock_quotes.py`
2. Fetch recent news for the stock
3. Provide context from market summary
4. Summarize key points and recommendations

### Workflow 3: Sector Analysis
1. Get market summary to identify sector trends
2. Fetch industry-specific news
3. Compare sector performance
4. Identify leading stocks in the sector

## Troubleshooting

### Common Issues

**Issue**: RSS feed not accessible
**Solution**: Try alternative source or check internet connectivity

**Issue**: Stock quote API returns error
**Solution**: Check stock code format, verify market parameter, or try alternative API

**Issue**: Data appears outdated
**Solution**: Check API status, verify data delay settings

**Issue**: Cross-origin errors when accessing from browser
**Solution**: Use CORS proxy or server-side implementation

## Integration with OpenClaw

This skill can be integrated into OpenClaw by:
1. Adding skill to OpenClaw's skill registry
2. Configuring skill parameters in OpenClaw settings
3. Enabling skill for user-initiated queries
4. Setting up automated periodic updates

## Future Enhancements

- Add support for real-time websocket data
- Implement technical analysis indicators
- Add portfolio tracking features
- Support for crypto markets
- Sentiment analysis of news
- Alert system for price movements
- Backtesting capabilities

## License

MIT License - See LICENSE file for details
