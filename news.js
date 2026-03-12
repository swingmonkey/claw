// 新闻API配置
const NEWS_API_KEY = 'demo'; // 实际使用时替换为真实API密钥
const NEWS_API_URL = 'https://newsapi.org/v2';

// RSS到JSON转换服务
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';

// 新闻源配置 - 国内可访问的RSS源
const NEWS_SOURCES = {
    cctv: {
        name: '央视新闻',
        rss: 'https://news.cctv.com/rss/news.xml',
        category: 'general'
    },
    xinhua: {
        name: '新华网',
        rss: 'http://www.xinhuanet.com/politics/news_politics.xml',
        category: 'general'
    },
    people: {
        name: '人民网',
        rss: 'http://www.people.com.cn/rss/politics.xml',
        category: 'general'
    },
    ifeng: {
        name: '凤凰网',
        rss: 'http://news.ifeng.com/rss/index.xml',
        category: 'general'
    },
    sina: {
        name: '新浪新闻',
        rss: 'http://news.sina.com.cn/rss/focus.xml',
        category: 'general'
    },
    36kr: {
        name: '36氪',
        rss: 'https://36kr.com/feed',
        category: 'tech'
    },
    tech163: {
        name: '网易科技',
        rss: 'https://tech.163.com/special/00097UHL/tech_datalist.xml',
        category: 'tech'
    },
    it之家: {
        name: 'IT之家',
        rss: 'https://www.ithome.com/rss/',
        category: 'tech'
    },
    zhihu_daily: {
        name: '知乎日报',
        rss: 'https://daily.zhihu.com/rss',
        category: 'tech'
    },
    cnbeta: {
        name: 'cnBeta',
        rss: 'https://www.cnbeta.com/backend.php',
        category: 'tech'
    }
};

// 全局状态
let allNews = [];
let filteredNews = [];
let autoRefreshInterval = null;
let currentSettings = {
    sources: ['cctv', 'xinhua', 'people', 'ifeng', '36kr', 'it之家'],
    refreshInterval: 60000,
    itemsPerPage: 30
};

// DOM元素
const newsContainer = document.getElementById('newsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const emptyState = document.getElementById('emptyState');
const refreshBtn = document.getElementById('refreshBtn');
const autoRefreshToggle = document.getElementById('autoRefreshToggle');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementById('closeModal');
const saveSettings = document.getElementById('saveSettings');
const searchInput = document.getElementById('searchInput');
const totalCount = document.getElementById('totalCount');
const lastUpdate = document.getElementById('lastUpdate');
const statusIndicator = document.getElementById('statusIndicator');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupEventListeners();
    fetchNews();
    startAutoRefresh();
});

// 设置事件监听器
function setupEventListeners() {
    refreshBtn.addEventListener('click', () => {
        fetchNews();
    });

    autoRefreshToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            startAutoRefresh();
        } else {
            stopAutoRefresh();
        }
    });

    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    saveSettings.addEventListener('click', () => {
        saveUserSettings();
        settingsModal.style.display = 'none';
    });

    searchInput.addEventListener('input', debounce((e) => {
        filterNews(e.target.value);
    }, 300));

    // 分类筛选
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterByCategory(e.target.dataset.category);
        });
    });
}

// 从RSS获取新闻
async function fetchRSSFeed(sourceId) {
    const source = NEWS_SOURCES[sourceId];
    try {
        const response = await fetch(`${RSS2JSON_API}?rss_url=${encodeURIComponent(source.rss)}`);
        const data = await response.json();
        
        if (data.status === 'ok') {
            return data.items.map(item => ({
                title: item.title,
                description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                link: item.link,
                pubDate: item.pubDate,
                source: source.name,
                category: source.category,
                thumbnail: item.thumbnail || null
            }));
        }
        return [];
    } catch (error) {
        console.error(`Error fetching ${source.name}:`, error);
        return [];
    }
}

// 获取所有新闻
async function fetchNews() {
    updateStatus('加载中...', 'warning');
    showLoading(true);
    
    try {
        const promises = currentSettings.sources.map(sourceId => fetchRSSFeed(sourceId));
        const results = await Promise.all(promises);
        
        allNews = results.flat();
        
        // 按发布时间排序
        allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        
        // 限制显示数量
        allNews = allNews.slice(0, currentSettings.itemsPerPage);
        
        filteredNews = [...allNews];
        displayNews(filteredNews);
        
        updateStats();
        updateStatus('已更新', 'success');
        showLoading(false);
        
    } catch (error) {
        console.error('Error fetching news:', error);
        updateStatus('加载失败', 'error');
        showLoading(false);
        showEmptyState();
    }
}

// 显示新闻
function displayNews(news) {
    newsContainer.innerHTML = '';
    
    if (news.length === 0) {
        showEmptyState();
        return;
    }
    
    news.forEach((item, index) => {
        const card = createNewsCard(item, index);
        newsContainer.appendChild(card);
    });
}

// 创建新闻卡片
function createNewsCard(item, index) {
    const card = document.createElement('article');
    card.className = 'news-card';
    card.style.animationDelay = `${index * 30}ms`;
    card.dataset.newsIndex = index;
    
    const timeAgo = getTimeAgo(item.pubDate);
    const categoryEmoji = getCategoryEmoji(item.category);
    
    // 编码URL参数
    const encodedTitle = encodeURIComponent(item.title);
    const encodedLink = encodeURIComponent(item.link);
    const encodedSource = encodeURIComponent(item.source);
    const encodedCategory = encodeURIComponent(item.category);
    const encodedPubDate = encodeURIComponent(item.pubDate);
    
    card.innerHTML = `
        <div class="news-card-content">
            <div class="news-meta">
                <span class="news-tag">${categoryEmoji}</span>
                <span class="news-source">${item.source}</span>
                <span class="news-time">${timeAgo}</span>
            </div>
            <h3 class="news-title">${item.title}</h3>
            <p class="news-description">${item.description}</p>
            <div class="news-footer">
                <a href="news-detail.html?link=${encodedLink}&title=${encodedTitle}&source=${encodedSource}&category=${encodedCategory}&pubDate=${encodedPubDate}" class="news-link">查看详情 →</a>
                <a href="${item.link}" target="_blank" class="news-link" style="margin-left: 12px;">原文</a>
            </div>
        </div>
    `;
    
    return card;
}

// 筛选新闻
function filterNews(searchTerm) {
    if (!searchTerm) {
        filteredNews = [...allNews];
    } else {
        const term = searchTerm.toLowerCase();
        filteredNews = allNews.filter(item => 
            item.title.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term) ||
            item.source.toLowerCase().includes(term)
        );
    }
    displayNews(filteredNews);
    updateStats();
}

// 按分类筛选
function filterByCategory(category) {
    if (category === 'all') {
        filteredNews = [...allNews];
    } else {
        filteredNews = allNews.filter(item => item.category === category);
    }
    displayNews(filteredNews);
    updateStats();
}

// 自动刷新
function startAutoRefresh() {
    stopAutoRefresh();
    autoRefreshInterval = setInterval(() => {
        fetchNews();
    }, currentSettings.refreshInterval);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// 显示/隐藏加载状态
function showLoading(show) {
    loadingIndicator.style.display = show ? 'flex' : 'none';
    emptyState.style.display = 'none';
}

// 显示空状态
function showEmptyState() {
    emptyState.style.display = 'flex';
    loadingIndicator.style.display = 'none';
}

// 更新统计信息
function updateStats() {
    totalCount.textContent = filteredNews.length;
    lastUpdate.textContent = new Date().toLocaleTimeString('zh-CN');
}

// 更新状态
function updateStatus(text, type) {
    statusIndicator.textContent = text;
    statusIndicator.className = 'stat-value status';
    statusIndicator.style.color = type === 'success' ? 'var(--success-color)' : 
                                  type === 'warning' ? 'var(--warning-color)' : 
                                  'var(--error-color)';
}

// 保存设置
function saveUserSettings() {
    const checkboxes = document.querySelectorAll('.news-sources input[type="checkbox"]:checked');
    currentSettings.sources = Array.from(checkboxes).map(cb => cb.value);
    
    currentSettings.refreshInterval = parseInt(document.getElementById('refreshInterval').value);
    currentSettings.itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    
    // 更新刷新标签
    const intervalMinutes = currentSettings.refreshInterval / 60000;
    document.querySelector('.refresh-label').textContent = `自动刷新 (${intervalMinutes}分钟)`;
    
    localStorage.setItem('newsSettings', JSON.stringify(currentSettings));
    
    // 重新获取新闻
    fetchNews();
    startAutoRefresh();
}

// 加载设置
function loadSettings() {
    const saved = localStorage.getItem('newsSettings');
    if (saved) {
        currentSettings = JSON.parse(saved);
        
        // 更新UI
        document.querySelectorAll('.news-sources input[type="checkbox"]').forEach(cb => {
            cb.checked = currentSettings.sources.includes(cb.value);
        });
        
        document.getElementById('refreshInterval').value = currentSettings.refreshInterval;
        document.getElementById('itemsPerPage').value = currentSettings.itemsPerPage;
        
        const intervalMinutes = currentSettings.refreshInterval / 60000;
        document.querySelector('.refresh-label').textContent = `自动刷新 (${intervalMinutes}分钟)`;
    }
}

// 获取分类emoji
function getCategoryEmoji(category) {
    const emojis = {
        tech: '💻',
        business: '💰',
        world: '🌍',
        sports: '⚽',
        entertainment: '🎬',
        general: '📰',
        politics: '🏛️'
    };
    return emojis[category] || '📰';
}

// 获取相对时间
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return '刚刚';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}天前`;
    
    return date.toLocaleDateString('zh-CN');
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 添加淡入动画
const style = document.createElement('style');
style.textContent = `
    .news-card {
        animation: fadeIn 0.5s ease forwards;
        opacity: 0;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
