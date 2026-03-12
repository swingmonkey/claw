// Stock News Application

// Configuration
const CONFIG = {
    API_BASE: 'http://hq.sinajs.cn/list=',
    NEWS_SOURCES: {
        eastmoney: 'http://finance.eastmoney.com/rss/finance.xml',
        sina: 'http://finance.sina.com.cn/roll/index.d.html',
        '10jqka': 'http://news.10jqka.com.cn/rss/headline.xml'
    }
};

// State
let state = {
    watchlist: [],
    currentNewsSource: 'eastmoney',
    settings: {
        autoRefresh: true,
        refreshInterval: 30000,
        market: 'cn'
    },
    autoRefreshTimer: null
};

// DOM Elements
const elements = {
    marketSummary: document.getElementById('marketSummary'),
    stockList: document.getElementById('stockList'),
    newsList: document.getElementById('newsList'),
    refreshNewsBtn: document.getElementById('refreshNewsBtn'),
    refreshQuotesBtn: document.getElementById('refreshQuotesBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    addStockBtn: document.getElementById('addStockBtn'),
    addStockModal: document.getElementById('addStockModal'),
    settingsModal: document.getElementById('settingsModal'),
    stockCodeInput: document.getElementById('stockCodeInput'),
    stockNameInput: document.getElementById('stockNameInput'),
    autoRefreshInterval: document.getElementById('autoRefreshInterval'),
    autoRefreshEnabled: document.getElementById('autoRefreshEnabled'),
    marketType: document.getElementById('marketType')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    setupEventListeners();
    fetchMarketSummary();
    fetchNews();
    startAutoRefresh();
});

// Load saved state
function loadState() {
    const savedWatchlist = localStorage.getItem('stockWatchlist');
    const savedSettings = localStorage.getItem('stockSettings');
    
    if (savedWatchlist) {
        state.watchlist = JSON.parse(savedWatchlist);
    }
    
    if (savedSettings) {
        state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
        updateSettingsUI();
    }
    
    if (state.watchlist.length > 0) {
        fetchStockQuotes();
    }
}

// Save state
function saveState() {
    localStorage.setItem('stockWatchlist', JSON.stringify(state.watchlist));
    localStorage.setItem('stockSettings', JSON.stringify(state.settings));
}

// Setup event listeners
function setupEventListeners() {
    elements.refreshNewsBtn.addEventListener('click', fetchNews);
    elements.refreshQuotesBtn.addEventListener('click', fetchStockQuotes);
    elements.settingsBtn.addEventListener('click', () => openModal(elements.settingsModal));
    elements.addStockBtn.addEventListener('click', () => openModal(elements.addStockModal));
    
    // Close modals
    document.getElementById('closeAddStock').addEventListener('click', () => closeModal(elements.addStockModal));
    document.getElementById('closeSettings').addEventListener('click', () => closeModal(elements.settingsModal));
    document.getElementById('confirmAddStock').addEventListener('click', addStock);
    document.getElementById('saveSettings').addEventListener('click', saveSettings);
    
    // Close on background click
    window.addEventListener('click', (e) => {
        if (e.target === elements.addStockModal) closeModal(elements.addStockModal);
        if (e.target === elements.settingsModal) closeModal(elements.settingsModal);
    });
    
    // News source filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.currentNewsSource = e.target.dataset.source;
            fetchNews();
        });
    });
}

// Fetch market summary
async function fetchMarketSummary() {
    showLoading(elements.marketSummary);
    
    try {
        // Fetch indices
        const indices = ['000001', '399001', '000300'];
        const response = await fetch(`${CONFIG.API_BASE}${indices.map(i => 'sh' + i).join(',')}`);
        const data = await response.text();
        
        const summary = parseMarketData(data, indices);
        renderMarketSummary(summary);
    } catch (error) {
        console.error('Error fetching market summary:', error);
        showError(elements.marketSummary, '加载失败');
    }
}

// Fetch stock quotes
async function fetchStockQuotes() {
    if (state.watchlist.length === 0) {
        renderEmptyWatchlist();
        return;
    }
    
    showLoading(elements.stockList);
    
    try {
        const codes = state.watchlist.map(s => {
            const code = s.code.padStart(6, '0');
            return code.startsWith('6') ? `sh${code}` : `sz${code}`;
        }).join(',');
        
        const response = await fetch(`${CONFIG.API_BASE}${codes}`);
        const data = await response.text();
        
        const quotes = parseStockQuotes(data);
        renderStockQuotes(quotes);
    } catch (error) {
        console.error('Error fetching stock quotes:', error);
        showError(elements.stockList, '加载失败');
    }
}

// Fetch news
async function fetchNews() {
    showLoading(elements.newsList);
    
    try {
        // Simulate news fetch (in production, use actual RSS parsing)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const news = generateMockNews();
        renderNews(news);
    } catch (error) {
        console.error('Error fetching news:', error);
        showError(elements.newsList, '加载失败');
    }
}

// Parse market data
function parseMarketData(data, indices) {
    const summary = {
        indices: [],
        sentiment: 'neutral',
        timestamp: new Date().toLocaleTimeString('zh-CN')
    };
    
    indices.forEach((code, i) => {
        const pattern = `var hq_str_sh${code}="([^"]+)"`;
        const match = data.match(pattern);
        
        if (match) {
            const values = match[1].split(',');
            const name = code === '000001' ? '上证指数' : 
                       code === '399001' ? '深证成指' : '沪深300';
            const close = parseFloat(values[3]);
            const preClose = parseFloat(values[2]);
            
            summary.indices.push({
                name,
                code,
                close,
                change: close - preClose,
                percent: ((close - preClose) / preClose * 100)
            });
        }
    });
    
    // Calculate sentiment
    const avgChange = summary.indices.reduce((sum, idx) => sum + idx.percent, 0) / summary.indices.length;
    summary.sentiment = avgChange > 1 ? 'bullish' : avgChange < -1 ? 'bearish' : 'neutral';
    
    return summary;
}

// Parse stock quotes
function parseStockQuotes(data) {
    return state.watchlist.map(stock => {
        const code = stock.code.padStart(6, '0');
        const prefix = code.startsWith('6') ? 'sh' : 'sz';
        const pattern = `var hq_str_${prefix}${code}="([^"]+)"`;
        const match = data.match(pattern);
        
        if (match) {
            const values = match[1].split(',');
            const close = parseFloat(values[3]);
            const preClose = parseFloat(values[2]);
            
            return {
                ...stock,
                close,
                open: parseFloat(values[1]),
                high: parseFloat(values[4]),
                low: parseFloat(values[5]),
                volume: parseInt(values[9]),
                change: close - preClose,
                percent: ((close - preClose) / preClose * 100)
            };
        }
        
        return null;
    }).filter(Boolean);
}

// Generate mock news (for demo)
function generateMockNews() {
    const sources = {
        eastmoney: '东方财富网',
        sina: '新浪财经',
        '10jqka': '同花顺'
    };
    
    return [
        {
            title: 'A股三大指数集体收涨,创业板指涨超2%',
            source: sources[state.currentNewsSource],
            time: '10分钟前',
            description: '今日A股三大指数集体收涨,其中创业板指涨幅超过2%,市场情绪明显回暖...'
        },
        {
            title: '央行宣布降准0.25个百分点,释放长期资金约1万亿元',
            source: sources[state.currentNewsSource],
            time: '30分钟前',
            description: '中国人民银行决定于近期下调金融机构存款准备金率0.25个百分点...'
        },
        {
            title: '科技股领涨,芯片板块涨幅居前',
            source: sources[state.currentNewsSource],
            time: '1小时前',
            description: '今日科技股表现强势,芯片、半导体等板块涨幅居前...'
        },
        {
            title: '北向资金净流入超50亿元',
            source: sources[state.currentNewsSource],
            time: '2小时前',
            description: '今日北向资金大幅净流入,单日净流入超过50亿元...'
        }
    ];
}

// Render functions
function renderMarketSummary(summary) {
    const sentimentText = {
        bullish: '🟢 市场情绪: 看涨',
        bearish: '🔴 市场情绪: 看跌',
        neutral: '🟡 市场情绪: 中性'
    };
    
    elements.marketSummary.innerHTML = `
        <div class="sentiment-badge ${summary.sentiment}">
            ${sentimentText[summary.sentiment]}
        </div>
        <div class="update-time">更新时间: ${summary.timestamp}</div>
        <div class="indices-grid">
            ${summary.indices.map(idx => `
                <div class="index-card">
                    <div class="index-name">${idx.name}</div>
                    <div class="index-value">${idx.close.toFixed(2)}</div>
                    <div class="index-change ${idx.change >= 0 ? 'up' : 'down'}">
                        ${idx.change >= 0 ? '+' : ''}${idx.change.toFixed(2)} (${idx.percent.toFixed(2)}%)
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderStockQuotes(quotes) {
    if (quotes.length === 0) {
        renderEmptyWatchlist();
        return;
    }
    
    elements.stockList.innerHTML = quotes.map(quote => `
        <div class="stock-card" onclick="window.open('https://quote.eastmoney.com/${quote.code}.html', '_blank')">
            <div class="stock-header">
                <div>
                    <div class="stock-name">${quote.name}</div>
                    <div class="stock-code">${quote.code}</div>
                </div>
            </div>
            <div class="stock-price">${quote.close.toFixed(2)}</div>
            <div class="stock-change ${quote.change >= 0 ? 'up' : 'down'}">
                ${quote.change >= 0 ? '+' : ''}${quote.change.toFixed(2)} (${quote.percent.toFixed(2)}%)
            </div>
            <div class="stock-details">
                <div class="stock-detail-item">
                    <span>开盘</span><span>${quote.open.toFixed(2)}</span>
                </div>
                <div class="stock-detail-item">
                    <span>最高</span><span>${quote.high.toFixed(2)}</span>
                </div>
                <div class="stock-detail-item">
                    <span>最低</span><span>${quote.low.toFixed(2)}</span>
                </div>
                <div class="stock-detail-item">
                    <span>成交量</span><span>${quote.volume.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderNews(news) {
    elements.newsList.innerHTML = news.map(item => `
        <div class="news-item" onclick="window.open('#', '_blank')">
            <div class="news-meta">
                <span class="news-source">${item.source}</span>
                <span class="news-time">${item.time}</span>
            </div>
            <h3 class="news-title">${item.title}</h3>
            <p class="news-description">${item.description}</p>
            <a href="#" class="news-link">阅读全文 →</a>
        </div>
    `).join('');
}

function renderEmptyWatchlist() {
    elements.stockList.innerHTML = `
        <div class="empty-state">
            <span>📭</span>
            <p>暂无自选股</p>
            <p class="small">点击"+ 添加"按钮添加股票</p>
        </div>
    `;
}

// UI Helper functions
function showLoading(element) {
    element.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>正在加载...</p>
        </div>
    `;
}

function showError(element, message) {
    element.innerHTML = `
        <div class="empty-state">
            <span>⚠️</span>
            <p>${message}</p>
            <p class="small">请稍后重试</p>
        </div>
    `;
}

function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Add stock
function addStock() {
    const code = elements.stockCodeInput.value.trim();
    const name = elements.stockNameInput.value.trim();
    
    if (!code || !name) {
        alert('请填写完整的股票信息');
        return;
    }
    
    state.watchlist.push({ code, name });
    saveState();
    fetchStockQuotes();
    closeModal(elements.addStockModal);
    
    // Clear inputs
    elements.stockCodeInput.value = '';
    elements.stockNameInput.value = '';
}

// Save settings
function saveSettings() {
    state.settings.autoRefresh = elements.autoRefreshEnabled.checked;
    state.settings.refreshInterval = parseInt(elements.autoRefreshInterval.value) * 1000;
    state.settings.market = elements.marketType.value;
    
    saveState();
    closeModal(elements.settingsModal);
    
    // Restart auto refresh
    startAutoRefresh();
    
    alert('设置已保存');
}

function updateSettingsUI() {
    elements.autoRefreshEnabled.checked = state.settings.autoRefresh;
    elements.autoRefreshInterval.value = state.settings.refreshInterval / 1000;
    elements.marketType.value = state.settings.market;
}

// Auto refresh
function startAutoRefresh() {
    stopAutoRefresh();
    
    if (!state.settings.autoRefresh) {
        return;
    }
    
    state.autoRefreshTimer = setInterval(() => {
        fetchMarketSummary();
        if (state.watchlist.length > 0) {
            fetchStockQuotes();
        }
    }, state.settings.refreshInterval);
}

function stopAutoRefresh() {
    if (state.autoRefreshTimer) {
        clearInterval(state.autoRefreshTimer);
        state.autoRefreshTimer = null;
    }
}
