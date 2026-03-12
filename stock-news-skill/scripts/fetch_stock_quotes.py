#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Stock Quotes Fetcher
Retrieves real-time stock quotes from various financial APIs.
"""

import requests
import json
import sys
import argparse
from datetime import datetime
from typing import List, Dict, Optional

# API Endpoints (using free public APIs)
API_ENDPOINTS = {
    'sina': 'http://hq.sinajs.cn/list=',
    'eastmoney': 'http://push2.eastmoney.com/api/qt/ulist.np/get?',
    'qq': 'http://qt.gtimg.cn/q='
}

def parse_sina_stock_data(stock_code: str, data: str) -> Dict:
    """
    Parse stock data from Sina Finance API.
    """
    try:
        # Sina returns data in format: var hq_str_000001="name,open,preclose,close,high,low,buy,sell,turnover,volume,..."
        import re
        pattern = r'="([^"]+)"'
        match = re.search(pattern, data)
        
        if not match:
            return None
            
        values = match.group(1).split(',')
        
        return {
            'code': stock_code,
            'name': values[0],
            'open': float(values[1]) if values[1] else None,
            'preclose': float(values[2]) if values[2] else None,
            'close': float(values[3]) if values[3] else None,
            'high': float(values[4]) if values[4] else None,
            'low': float(values[5]) if values[5] else None,
            'buy': float(values[6]) if values[6] else None,
            'sell': float(values[7]) if values[7] else None,
            'turnover': float(values[8]) if values[8] else None,
            'volume': int(values[9]) if values[9] else None,
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Error parsing Sina data for {stock_code}: {e}", file=sys.stderr)
        return None

def parse_eastmoney_stock_data(stock_code: str, data: dict) -> Dict:
    """
    Parse stock data from Eastmoney API.
    """
    try:
        if not data or 'data' not in data or not data['data']:
            return None
            
        item = data['data']['diff'][0]
        
        return {
            'code': stock_code,
            'name': item.get('f58', ''),
            'open': item.get('f46', 0) / 100,
            'preclose': item.get('f60', 0) / 100,
            'close': item.get('f43', 0) / 100,
            'high': item.get('f44', 0) / 100,
            'low': item.get('f45', 0) / 100,
            'volume': item.get('f47', 0),
            'turnover': item.get('f168', 0),
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Error parsing Eastmoney data for {stock_code}: {e}", file=sys.stderr)
        return None

def format_stock_code(stock_code: str, market: str) -> str:
    """
    Format stock code according to market.
    """
    market = market.lower()
    
    if market == 'cn':
        # A-shares: 6-digit codes
        code = stock_code.zfill(6)
        if code.startswith('6'):
            # Shanghai: 600000, 688xxx (STAR Market)
            return f'sh{code}'
        elif code.startswith('0') or code.startswith('3'):
            # Shenzhen: 000xxx, 002xxx, 300xxx
            return f'sz{code}'
        else:
            return code
    elif market == 'hk':
        # Hong Kong: 4-5 digit codes
        return f'hk{stock_code}'
    elif market == 'us':
        # US: stock symbols
        return stock_code.upper()
    else:
        return stock_code

def fetch_from_sina(stock_codes: List[str], market: str = 'cn') -> List[Dict]:
    """
    Fetch stock quotes from Sina Finance API.
    """
    formatted_codes = [format_stock_code(code, market) for code in stock_codes]
    url = API_ENDPOINTS['sina'] + ','.join(formatted_codes)
    
    try:
        response = requests.get(url, timeout=10)
        response.encoding = 'gbk'
        data = response.text
        
        results = []
        for i, code in enumerate(stock_codes):
            # Extract data for each stock
            import re
            pattern = f'var hq_str_{formatted_codes[i]}="([^"]+)"'
            match = re.search(pattern, data)
            
            if match:
                stock_data = parse_sina_stock_data(code, f'var hq_str_{formatted_codes[i]}="{match.group(1)}"')
                if stock_data:
                    # Calculate change and percent
                    if stock_data['close'] and stock_data['preclose']:
                        stock_data['change'] = stock_data['close'] - stock_data['preclose']
                        stock_data['percent'] = (stock_data['change'] / stock_data['preclose']) * 100 if stock_data['preclose'] else 0
                    
                    results.append(stock_data)
        
        return results
        
    except Exception as e:
        print(f"Error fetching from Sina: {e}", file=sys.stderr)
        return []

def fetch_from_eastmoney(stock_codes: List[str], market: str = 'cn') -> List[Dict]:
    """
    Fetch stock quotes from Eastmoney API.
    """
    # Format codes for Eastmoney API
    formatted_codes = []
    for code in stock_codes:
        code_str = code.zfill(6)
        if code_str.startswith('6'):
            formatted_codes.append(f'1.{code_str}')
        elif code_str.startswith('0'):
            formatted_codes.append(f'0.{code_str}')
        elif code_str.startswith('3'):
            formatted_codes.append(f'0.{code_str}')
        else:
            formatted_codes.append(f'0.{code_str}')
    
    params = {
        'fltt': '2',
        'invt': '2',
        'fields': 'f58,f43,f44,f45,f46,f60,f47,f168',
        'secids': ','.join(formatted_codes),
        '_': str(int(datetime.now().timestamp()))
    }
    
    try:
        response = requests.get(API_ENDPOINTS['eastmoney'], params=params, timeout=10)
        data = response.json()
        
        results = []
        for i, code in enumerate(stock_codes):
            stock_data = parse_eastmoney_stock_data(code, data)
            if stock_data:
                # Calculate change and percent
                if stock_data['close'] and stock_data['preclose']:
                    stock_data['change'] = stock_data['close'] - stock_data['preclose']
                    stock_data['percent'] = (stock_data['change'] / stock_data['preclose']) * 100 if stock_data['preclose'] else 0
                
                results.append(stock_data)
        
        return results
        
    except Exception as e:
        print(f"Error fetching from Eastmoney: {e}", file=sys.stderr)
        return []

def fetch_stock_quotes(symbols: str, market: str = 'cn', 
                    api: str = 'sina', fields: str = None) -> List[Dict]:
    """
    Fetch stock quotes for specified symbols.
    
    Args:
        symbols: Comma-separated stock codes
        market: Market type (cn, hk, us)
        api: API to use (sina, eastmoney)
        fields: Fields to retrieve
        
    Returns:
        List of stock quote data
    """
    stock_codes = [code.strip() for code in symbols.split(',') if code.strip()]
    
    if not stock_codes:
        print("Error: No stock codes provided", file=sys.stderr)
        return []
    
    # Fetch from specified API
    if api == 'eastmoney':
        quotes = fetch_from_eastmoney(stock_codes, market)
    else:
        # Default to Sina
        quotes = fetch_from_sina(stock_codes, market)
    
    # Filter by requested fields if specified
    if fields:
        requested_fields = [f.strip() for f in fields.split(',')]
        for quote in quotes:
            quote.keys()  # Just to ensure all keys exist before filtering
            filtered_quote = {k: v for k, v in quote.items() if k in requested_fields}
            quote.clear()
            quote.update(filtered_quote)
    
    return quotes

def format_quotes_output(quotes: List[Dict], output_format: str = 'json') -> str:
    """
    Format stock quotes for output.
    """
    if output_format == 'json':
        return json.dumps(quotes, ensure_ascii=False, indent=2)
    
    elif output_format == 'text':
        lines = []
        for quote in quotes:
            change_color = "🔴" if quote.get('change', 0) < 0 else "🟢"
            lines.append(f"\n{quote.get('name', 'N/A')} ({quote.get('code', 'N/A')})")
            lines.append(f"   价格: {quote.get('close', 'N/A')}")
            lines.append(f"   涨跌: {change_color} {quote.get('change', 0):.2f} ({quote.get('percent', 0):.2f}%)")
            lines.append(f"   开盘: {quote.get('open', 'N/A')}")
            lines.append(f"   最高: {quote.get('high', 'N/A')}")
            lines.append(f"   最低: {quote.get('low', 'N/A')}")
            lines.append(f"   成交量: {quote.get('volume', 'N/A')}")
            lines.append(f"   成交额: {quote.get('turnover', 'N/A')}")
        return '\n'.join(lines)
    
    elif output_format == 'table':
        lines = []
        lines.append(f"{'名称':<8} {'代码':<8} {'价格':>10} {'涨跌':>10} {'涨跌幅':>10} {'成交量':>12}")
        lines.append("-" * 70)
        for quote in quotes:
            lines.append(f"{quote.get('name', 'N/A'):<8} {quote.get('code', 'N/A'):<8} "
                      f"{quote.get('close', 'N/A'):>10.2f} {quote.get('change', 0):>10.2f} "
                      f"{quote.get('percent', 0):>10.2f}% {quote.get('volume', 'N/A'):>12}")
        return '\n'.join(lines)
    
    return json.dumps(quotes, ensure_ascii=False, indent=2)

def main():
    parser = argparse.ArgumentParser(description='Fetch stock quotes from financial APIs')
    parser.add_argument('--symbols', type=str, required=True,
                       help='Comma-separated stock codes (e.g., 000001,600036,00700)')
    parser.add_argument('--market', type=str, default='cn',
                       choices=['cn', 'hk', 'us'],
                       help='Market type (default: cn)')
    parser.add_argument('--api', type=str, default='sina',
                       choices=['sina', 'eastmoney'],
                       help='API to use (default: sina)')
    parser.add_argument('--fields', type=str,
                       help='Fields to retrieve (comma-separated)')
    parser.add_argument('--format', type=str, default='json',
                       choices=['json', 'text', 'table'],
                       help='Output format (default: json)')
    parser.add_argument('--output', type=str,
                       help='Output file path (optional)')
    
    args = parser.parse_args()
    
    # Fetch quotes
    print(f"Fetching quotes for {args.symbols} from {args.api}...", file=sys.stderr)
    quotes = fetch_stock_quotes(args.symbols, args.market, args.api, args.fields)
    
    if not quotes:
        print("No quotes found.", file=sys.stderr)
        sys.exit(1)
    
    # Format output
    output = format_quotes_output(quotes, args.format)
    
    # Write output
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"Saved quotes to {args.output}", file=sys.stderr)
    else:
        print(output)

if __name__ == '__main__':
    main()
