import yfinance as yf
import pandas as pd
import numpy as np
import itertools
import json
import sys
from statsmodels.tsa.stattools import coint, adfuller
import random

def fetch_equity_tickers(category, universe_size):
    """Fetch a random list of equity tickers from Yahoo Finance based on category."""
    sector_tickers = {
        "Tech": ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'META', 'TSLA', 'ORCL', 'IBM', 'AMD', 'ADBE'],
        "Finance": ['JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'AXP', 'USB', 'PNC', 'TFC'],
        "Energy": ['XOM', 'CVX', 'COP', 'EOG', 'MPC', 'PSX', 'VLO', 'OKE', 'HES', 'SLB'],
        "Healthcare": ['JNJ', 'PFE', 'MRNA', 'BMY', 'LLY', 'CVS', 'UNH', 'ABBV', 'AMGN', 'GILD'],
        "Pharmaceutical": ['PFE', 'BMY', 'LLY', 'MRNA', 'REGN', 'BIIB', 'VRTX', 'GILD', 'SNY', 'NVS'],
        "Utilities": ['NEE', 'DUK', 'SO', 'D', 'AEP', 'EXC', 'XEL', 'SRE', 'PEG', 'ED'],
        "Industrials": ['GE', 'MMM', 'CAT', 'DE', 'BA', 'LMT', 'GD', 'NOC', 'UNP', 'CSX']
    }
    if category in sector_tickers:
        return random.sample(sector_tickers[category], min(universe_size, len(sector_tickers[category])))
    return []

def fetch_manual_tickers(asset_class):
    """Return a manual list of tickers for Commodities or FX Rates."""
    if asset_class == 'Commodities':
        return ['GC=F', 'CL=F', 'SI=F', 'ZC=F', 'NG=F']
    elif asset_class == 'FX Rates':
        return ['EURUSD=X', 'USDJPY=X', 'GBPUSD=X', 'AUDUSD=X', 'EURGBP=X', 'AUDJPY=X']
    return []

def fetch_data(tickers):
    """Fetch historical data using yfinance, handling missing tickers."""
    try:
        data = yf.download(tickers, start='2023-01-01', end='2024-01-01', timeout=60)
        if isinstance(data.columns, pd.MultiIndex):
            if "Adj Close" in data.columns.get_level_values(0):
                data = data.xs("Adj Close", axis=1, level=0, drop_level=True)
            elif "Close" in data.columns.get_level_values(0):
                data = data.xs("Close", axis=1, level=0, drop_level=True)
            else:
                return pd.DataFrame()
        elif "Adj Close" in data:
            data = data["Adj Close"]
        elif "Close" in data:
            data = data["Close"]
        else:
            return pd.DataFrame()
        return data.dropna(axis=1, how='all')
    except Exception as e:
        return pd.DataFrame()

def test_cointegration(series1, series2):
    score, p_value, _ = coint(series1, series2)
    return p_value

def test_adf(spread):
    return adfuller(spread)[1]

def identify_cointegrated_pairs(data):
    pairs = list(itertools.combinations(data.columns, 2))
    results = []
    for stock1, stock2 in pairs:
        series1, series2 = data[stock1].dropna(), data[stock2].dropna()
        if series1.empty or series2.empty:
            continue
        spread = series1 - series2
        results.append({
            'Stock 1': stock1,
            'Stock 2': stock2,
            'Cointegration P-Value': test_cointegration(series1, series2),
            'ADF P-Value': test_adf(spread),
            'Correlation': series1.corr(series2)
        })
    results_df = pd.DataFrame(results)
    if results_df.empty:
        return None
    best_pairs = results_df[results_df['Cointegration P-Value'] < 0.05]
    return best_pairs.sort_values(by='Cointegration P-Value').iloc[0] if not best_pairs.empty else None

def main(asset_class, sub_category, universe_size):
    tickers = fetch_equity_tickers(sub_category, universe_size) if asset_class == 'Equities' else fetch_manual_tickers(asset_class)
    data = fetch_data(tickers)
    if data.empty:
        print(json.dumps({"error": "No valid data available."}))
        return
    best_pair = identify_cointegrated_pairs(data)
    if best_pair is not None:
        print(json.dumps({"best_pair": [best_pair['Stock 1'], best_pair['Stock 2']], "pairs": best_pair.to_dict()}))
    else:
        print(json.dumps({"error": "No statistically significant pair found."}))

if __name__ == "__main__":
    try:
        user_input = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {"assetClass": "Equities", "subCategory": "Tech", "universeSize": 10}
        main(user_input['assetClass'], user_input['subCategory'], user_input['universeSize'])
    except Exception as e:
        print(json.dumps({"error": str(e)}))
