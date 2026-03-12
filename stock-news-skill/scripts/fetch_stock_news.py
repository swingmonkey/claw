#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Stock News Fetcher
Fetches real-time stock news from various Chinese financial sources via RSS feeds.
"""

import requests
import feedparser
import json
import sys
import argparse
from datetime import datetime
from typing import List, Dict, Optional
import time

# RSS Sources Configuration
RSS_SOURCES = {
    'eastmoney': {
        'name': '东方财富网',
        'rss': [
            'http://finance.eastmoney.com/rss/finance.xml',
            'http://finance.eastmoney.com/rss/company.xml',
        ],
        'category_map': {
            'general': '综合',
            'market': '大盘',
            'stock': '个股'
        }
    },
    'sina': {
        'name': '新浪财经',
        'rss': [
            'http://finance.sina.com.cn/roll/index.d.html',
            'http://finance.sina.com.cn/roll/stock.d.html',
        ],
        'category_map': {
            'general': '综合',
            'stock': '股票'
        }
    },
    '10jqka': {
        'name': '同花顺',
        'rss': [
            'http://news.10jqka.com.cn/rss/headline.xml',
        ],
        'category_map': {
            'general': '综合',
            'stock': '个股'
        }
    },
    'netease': {
        'name': '网易财经',
        'rss': [
            'http://money.163.com/special/00261FB6/stocknews.xml',
        ],
        'category_map': {
            'general': '综合',
            'market': '大盘'
        }
    },
    'jrj': {
        'name': '金融界',
        'rss': [
            'http://www.jrj.com.cn/rss/news.xml',
        ],
        'category_map': {
            'general': '综合',
            'stock': '个股'
        }
    }
}

def fetch_rss_feed(url: str, max_retries: int = 3) -> Optional[List[Dict]]:
    """
    Fetch and parse RSS feed with retry logic.
    
    Args:
        url: RSS feed URL
        max_retries: Maximum number of retry attempts
        
    Returns:
        List of news items or None if failed
    """
    for attempt in range(max_retries):
        try:
            feed = feedparser.parse(url)
            items = []
            
            for entry in feed.entries:
                try:
                    item = {
                        'title': entry.get('title', ''),
                        'link': entry.get('link', ''),
                        'pubDate': entry.get('published', datetime.now().isoformat()),
                        'description': entry.get('description', ''),
                        'author': entry.get('author', ''),
                        'tags': [tag.term for tag in entry.get('tags', [])]
                    }
                    items.append(item)
                except Exception as e:
                    print(f"Warning: Failed to parse entry: {e}", file=sys.stderr)
                    continue
            
            return items[:100]  # Limit to 100 items per feed
            
        except Exception as e:
            print(f"Attempt {attempt + 1}/{max_retries}: Failed to fetch {url}: {e}", file=sys.stderr)
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
    
    return None

def fetch_news(source: str = 'eastmoney', category: str = 'general', 
              limit: int = 20) -> List[Dict]:
    """
    Fetch news from specified source.
    
    Args:
        source: Source identifier (eastmoney, sina, 10jqka, netease, jrj)
        category: News category filter
        limit: Maximum number of items to return
        
    Returns:
        List of news items
    """
    if source not in RSS_SOURCES:
        print(f"Error: Unknown source '{source}'", file=sys.stderr)
        print(f"Available sources: {', '.join(RSS_SOURCES.keys())}", file=sys.stderr)
        return []
    
    source_config = RSS_SOURCES[source]
    all_items = []
    
    # Fetch from all RSS feeds for the source
    for rss_url in source_config['rss']:
        items = fetch_rss_feed(rss_url)
        if items:
            all_items.extend(items)
    
    if not all_items:
        print(f"Warning: No news items fetched from {source_config['name']}", file=sys.stderr)
        return []
    
    # Sort by publication date
    all_items.sort(key=lambda x: x.get('pubDate', ''), reverse=True)
    
    # Add source information
    for item in all_items:
        item['source'] = source_config['name']
        item['category'] = source_config['category_map'].get(category, '综合')
        
        # Clean up description
        if item.get('description'):
            # Remove HTML tags
            import re
            item['description'] = re.sub(r'<[^>]+>', '', item['description'])
            item['description'] = item['description'].strip()[:200] + '...' if len(item['description']) > 200 else item['description']
    
    return all_items[:limit]

def format_news_output(news_items: List[Dict], output_format: str = 'json') -> str:
    """
    Format news items for output.
    
    Args:
        news_items: List of news items
        output_format: Output format (json, text, html)
        
    Returns:
        Formatted output string
    """
    if output_format == 'json':
        return json.dumps(news_items, ensure_ascii=False, indent=2)
    
    elif output_format == 'text':
        lines = []
        for i, item in enumerate(news_items, 1):
            lines.append(f"\n{i}. {item['title']}")
            lines.append(f"   来源: {item['source']}")
            lines.append(f"   时间: {item['pubDate']}")
            lines.append(f"   分类: {item['category']}")
            lines.append(f"   链接: {item['link']}")
            if item.get('description'):
                lines.append(f"   摘要: {item['description']}")
        return '\n'.join(lines)
    
    elif output_format == 'html':
        html_items = []
        for item in news_items:
            html_items.append(f"""
            <div class="news-item">
                <h3 class="news-title">{item['title']}</h3>
                <div class="news-meta">
                    <span class="news-source">{item['source']}</span>
                    <span class="news-time">{item['pubDate']}</span>
                    <span class="news-category">{item['category']}</span>
                </div>
                {f'<p class="news-description">{item["description"]}</p>' if item.get('description') else ''}
                <a href="{item['link']}" class="news-link" target="_blank">阅读原文</a>
            </div>
            """)
        return f'<div class="news-container">\n{"".join(html_items)}\n</div>'
    
    return json.dumps(news_items, ensure_ascii=False, indent=2)

def main():
    parser = argparse.ArgumentParser(description='Fetch stock news from Chinese financial sources')
    parser.add_argument('--source', type=str, default='eastmoney',
                       choices=list(RSS_SOURCES.keys()),
                       help='News source (default: eastmoney)')
    parser.add_argument('--category', type=str, default='general',
                       choices=['general', 'market', 'stock', 'industry', 'policy', 'international'],
                       help='News category (default: general)')
    parser.add_argument('--limit', type=int, default=20,
                       help='Number of news items to fetch (default: 20)')
    parser.add_argument('--format', type=str, default='json',
                       choices=['json', 'text', 'html'],
                       help='Output format (default: json)')
    parser.add_argument('--output', type=str,
                       help='Output file path (optional)')
    
    args = parser.parse_args()
    
    # Fetch news
    print(f"Fetching news from {RSS_SOURCES[args.source]['name']}...", file=sys.stderr)
    news_items = fetch_news(args.source, args.category, args.limit)
    
    if not news_items:
        print("No news items found.", file=sys.stderr)
        sys.exit(1)
    
    # Format output
    output = format_news_output(news_items, args.format)
    
    # Write output
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"Saved {len(news_items)} news items to {args.output}", file=sys.stderr)
    else:
        print(output)

if __name__ == '__main__':
    main()
