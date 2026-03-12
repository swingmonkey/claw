#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Market Summary Generator
Generates comprehensive market overview for specified markets.
"""

import requests
import json
import sys
import argparse
from datetime import datetime
from typing import List, Dict
import re

# Major stock indices
MARKET_INDICES = {
    'cn': {
        'name': 'A股',
        'indices': [
            {'code': '000001', 'name': '上证指数'},
            {'code': '399001', 'name': '深证成指'},
            {'code': '399006', 'name': '创业板指'},
            {'code': '000300', 'name': '沪深300'},
            {'code': '000016', 'name': '上证50'},
        ]
    },
    'hk': {
        'name': '港股',
        'indices': [
            {'code': 'HSI', 'name': '恒生指数'},
            {'code': 'HSCEI', 'name': '国企指数'},
            {'code': 'HSTECH', 'name': '恒生科技'},
        ]
    },
    'us': {
        'name': '美股',
        'indices': [
            {'code': 'SPX', 'name': '标普500'},
            {'code': 'DJI', 'name': '道琼斯'},
            {'code': 'IXIC', 'name': '纳斯达克'},
        ]
    }
}

def fetch_index_quotes(market: str) -> List[Dict]:
    """
    Fetch quotes for major indices of specified market.
    """
    indices = MARKET_INDICES.get(market, {}).get('indices', [])
    if not indices:
        return []
    
    # Use Sina API for index quotes
    formatted_codes = [f'sh{idx["code"]}' if market == 'cn' else idx["code"] for idx in indices]
    url = f"http://hq.sinajs.cn/list={','.join(formatted_codes)}"
    
    try:
        response = requests.get(url, timeout=10)
        response.encoding = 'gbk'
        data = response.text
        
        quotes = []
        for i, idx in enumerate(indices):
            # Extract index data
            pattern = f'var hq_str_{formatted_codes[i]}="([^"]+)"'
            match = re.search(pattern, data)
            
            if match:
                values = match.group(1).split(',')
                quote = {
                    'code': idx['code'],
                    'name': idx['name'],
                    'open': float(values[1]) if values[1] else None,
                    'preclose': float(values[2]) if values[2] else None,
                    'close': float(values[3]) if values[3] else None,
                    'high': float(values[4]) if values[4] else None,
                    'low': float(values[5]) if values[5] else None,
                    'volume': int(values[9]) if values[9] else None,
                }
                
                # Calculate change and percent
                if quote['close'] and quote['preclose']:
                    quote['change'] = quote['close'] - quote['preclose']
                    quote['percent'] = (quote['change'] / quote['preclose']) * 100 if quote['preclose'] else 0
                
                quotes.append(quote)
        
        return quotes
        
    except Exception as e:
        print(f"Error fetching index quotes: {e}", file=sys.stderr)
        return []

def get_market_sentiment(market: str) -> Dict:
    """
    Get market sentiment based on index performance.
    """
    quotes = fetch_index_quotes(market)
    
    if not quotes:
        return {
            'status': 'unknown',
            'summary': '无法获取市场情绪'
        }
    
    # Calculate average change
    avg_change = sum(q.get('percent', 0) for q in quotes) / len(quotes)
    
    # Determine sentiment
    if avg_change > 1:
        status = 'bullish'
        summary = '市场情绪偏强，多数指数上涨'
    elif avg_change > 0:
        status = 'mild_bullish'
        summary = '市场情绪温和偏多，指数小幅上涨'
    elif avg_change > -1:
        status = 'mild_bearish'
        summary = '市场情绪偏弱，指数小幅下跌'
    else:
        status = 'bearish'
        summary = '市场情绪悲观，多数指数下跌'
    
    return {
        'status': status,
        'summary': summary,
        'avg_change': avg_change,
        'timestamp': datetime.now().isoformat()
    }

def get_top_movers(market: str, limit: int = 10) -> Dict:
    """
    Get top gainers and losers for the day.
    """
    # This is a simplified version - in production, you would:
    # 1. Fetch full stock list from exchange
    # 2. Sort by percent change
    # 3. Return top gainers and losers
    
    # For demo purposes, return mock data
    return {
        'gainers': [
            {'code': '600xxx', 'name': '示例股票1', 'percent': 9.98, 'close': 10.99},
            {'code': '000xxx', 'name': '示例股票2', 'percent': 8.76, 'close': 12.34},
        ],
        'losers': [
            {'code': '600xxx', 'name': '示例股票3', 'percent': -9.98, 'close': 8.76},
            {'code': '000xxx', 'name': '示例股票4', 'percent': -7.65, 'close': 15.43},
        ],
        'timestamp': datetime.now().isoformat()
    }

def get_sector_performance(market: str = 'cn') -> Dict:
    """
    Get sector/industry performance.
    """
    # This would fetch sector indices in production
    # For demo, return mock data
    
    sectors = [
        {'name': '金融', 'percent': 1.23},
        {'name': '科技', 'percent': 2.45},
        {'name': '消费', 'percent': -0.56},
        {'name': '医药', 'percent': 1.89},
        {'name': '新能源', 'percent': 3.12},
    ]
    
    # Sort by performance
    sectors.sort(key=lambda x: x['percent'], reverse=True)
    
    return {
        'sectors': sectors,
        'best': sectors[0] if sectors else None,
        'worst': sectors[-1] if sectors else None,
        'timestamp': datetime.now().isoformat()
    }

def generate_market_summary(market: str = 'cn') -> Dict:
    """
    Generate comprehensive market summary.
    """
    # Fetch all components
    indices = fetch_index_quotes(market)
    sentiment = get_market_sentiment(market)
    movers = get_top_movers(market)
    sectors = get_sector_performance(market)
    
    return {
        'market': market,
        'market_name': MARKET_INDICES.get(market, {}).get('name', ''),
        'indices': indices,
        'sentiment': sentiment,
        'top_movers': movers,
        'sectors': sectors,
        'timestamp': datetime.now().isoformat()
    }

def format_summary_output(summary: Dict, output_format: str = 'json') -> str:
    """
    Format market summary for output.
    """
    if output_format == 'json':
        return json.dumps(summary, ensure_ascii=False, indent=2)
    
    elif output_format == 'text':
        lines = []
        lines.append(f"\n{'='*60}")
        lines.append(f"{summary['market_name']}市场概览")
        lines.append(f"{'='*60}")
        lines.append(f"更新时间: {summary['timestamp']}")
        lines.append(f"\n市场情绪: {summary['sentiment']['summary']}")
        
        lines.append(f"\n主要指数:")
        for idx in summary['indices']:
            change_mark = "🔺" if idx.get('change', 0) > 0 else "🔻"
            lines.append(f"  {idx['name']}: {idx.get('close', 0):.2f} "
                      f"{change_mark} {idx.get('percent', 0):.2f}%")
        
        if summary['sectors'].get('sectors'):
            lines.append(f"\n行业表现:")
            for sector in summary['sectors']['sectors'][:5]:
                change_mark = "🔺" if sector['percent'] > 0 else "🔻"
                lines.append(f"  {sector['name']}: {sector['percent']:.2f}% {change_mark}")
        
        return '\n'.join(lines)
    
    elif output_format == 'html':
        html = f"""
        <div class="market-summary">
            <h2>{summary['market_name']}市场概览</h2>
            <div class="update-time">更新时间: {summary['timestamp']}</div>
            
            <div class="sentiment">
                <h3>市场情绪</h3>
                <p>{summary['sentiment']['summary']}</p>
            </div>
            
            <div class="indices">
                <h3>主要指数</h3>
                <table>
                    <thead>
                        <tr>
                            <th>指数</th>
                            <th>点位</th>
                            <th>涨跌</th>
                            <th>涨跌幅</th>
                        </tr>
                    </thead>
                    <tbody>
                        {"".join(f'''
                        <tr>
                            <td>{idx['name']}</td>
                            <td>{idx.get('close', 0):.2f}</td>
                            <td>{idx.get('change', 0):.2f}</td>
                            <td>{idx.get('percent', 0):.2f}%</td>
                        </tr>
                        ''' for idx in summary['indices'])}
                    </tbody>
                </table>
            </div>
        </div>
        """
        return html
    
    return json.dumps(summary, ensure_ascii=False, indent=2)

def main():
    parser = argparse.ArgumentParser(description='Generate market summary')
    parser.add_argument('--market', type=str, default='cn',
                       choices=['cn', 'hk', 'us'],
                       help='Market type (default: cn)')
    parser.add_argument('--format', type=str, default='json',
                       choices=['json', 'text', 'html'],
                       help='Output format (default: json)')
    parser.add_argument('--output', type=str,
                       help='Output file path (optional)')
    
    args = parser.parse_args()
    
    # Generate summary
    print(f"Generating market summary for {MARKET_INDICES[args.market]['name']}...", file=sys.stderr)
    summary = generate_market_summary(args.market)
    
    # Format output
    output = format_summary_output(summary, args.format)
    
    # Write output
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"Saved summary to {args.output}", file=sys.stderr)
    else:
        print(output)

if __name__ == '__main__':
    main()
