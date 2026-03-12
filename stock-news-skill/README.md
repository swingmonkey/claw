# 股票资讯 Skill - OpenClaw

一个功能完整的股票实时资讯获取skill,支持A股、港股、美股行情和资讯。

## 功能特性

### 核心功能
- ✅ **实时行情**: 支持A股、港股、美股实时行情查询
- ✅ **自选股管理**: 添加和管理自选股票列表
- ✅ **市场概览**: 显示主要指数和市场情绪
- ✅ **新闻聚合**: 支持多个国内财经新闻源
- ✅ **自动刷新**: 可自定义刷新间隔
- ✅ **响应式界面**: 完美适配桌面和移动设备

### 新闻源
- 东方财富网
- 新浪财经
- 同花顺

### 市场支持
- A股 (上海/深圳)
- 港股
- 美股

## 快速开始

### 使用Web界面
直接在浏览器中打开 `assets/frontend/stock.html`

### 使用Python脚本
```bash
python3 scripts/fetch_stock_news.py --source eastmoney --limit 20
python3 scripts/fetch_stock_quotes.py --symbols 000001,600036
python3 scripts/get_market_summary.py --market cn
```

## 许可证

MIT License
