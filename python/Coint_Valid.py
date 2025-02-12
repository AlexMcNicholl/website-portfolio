import yfinance as yf
import pandas as pd
import numpy as np
import itertools
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
        return ['GC=F', 'CL=F', 'SI=F', 'ZC=F', 'NG=F']  # Gold, Crude Oil, Silver, Corn, Natural Gas
    elif asset_class == 'FX Rates':
        return ['EURUSD=X', 'USDJPY=X', 'GBPUSD=X', 'AUDUSD=X', 'EURGBP=X', 'AUDJPY=X']
    return []

def fetch_data(tickers):
    """Fetch historical data using yfinance, handling missing tickers."""
    try:
        data = yf.download(tickers, start='2023-01-01', end='2024-01-01', timeout=60)
        print("Raw yfinance Data:\n", data.head())  # Debugging output
        
        # Handle multi-index columns if present
        if isinstance(data.columns, pd.MultiIndex):
            if "Adj Close" in data.columns.get_level_values(0):
                data = data.xs("Adj Close", axis=1, level=0, drop_level=True)
            elif "Close" in data.columns.get_level_values(0):
                data = data.xs("Close", axis=1, level=0, drop_level=True)
            else:
                print("❌ 'Adj Close' and 'Close' not found in response. Returning empty DataFrame.")
                return pd.DataFrame()
        elif "Adj Close" in data:
            data = data["Adj Close"]
        elif "Close" in data:
            data = data["Close"]
        else:
            print("❌ 'Adj Close' and 'Close' not found in response. Returning empty DataFrame.")
            return pd.DataFrame()

        # Drop columns with all NaN values (tickers that failed to download)
        data = data.dropna(axis=1, how='all')

        if data.empty:
            print("❌ No valid tickers retrieved. Check ticker availability.")
        return data

    except Exception as e:
        print(f"Error fetching data: {e}")
        return pd.DataFrame()



def test_cointegration(series1, series2):
    """Perform cointegration test and return p-value."""
    score, p_value, _ = coint(series1, series2)
    return p_value

def test_adf(spread):
    """Perform ADF test and return p-value."""
    return adfuller(spread)[1]

def identify_cointegrated_pairs(data):
    """Identify cointegrated pairs and return the best one."""
    pairs = list(itertools.combinations(data.columns, 2))
    results = []
    
    for stock1, stock2 in pairs:
        series1, series2 = data[stock1].dropna(), data[stock2].dropna()
        if series1.empty or series2.empty:
            continue
        
        spread = series1 - series2
        coint_p_value, adf_p_value = test_cointegration(series1, series2), test_adf(spread)
        correlation = series1.corr(series2)

        results.append({
            'Stock 1': stock1,
            'Stock 2': stock2,
            'Cointegration P-Value': coint_p_value,
            'ADF P-Value': adf_p_value,
            'Correlation': correlation
        })
    
    results_df = pd.DataFrame(results)
    
    if results_df.empty:
        print("❌ No valid pairs found.")
        return None
    
    print("\n🔍 All Tested Pairs:\n", results_df)

    best_pairs = results_df[
        (results_df['Cointegration P-Value'] < 0.05) & (results_df['ADF P-Value'] < 0.05)
    ]

    if best_pairs.empty:
        print("\n⚠️ No statistically significant pairs found. Returning the most cointegrated pair.")
        best_pair = results_df.sort_values(by='Cointegration P-Value').iloc[0]
    else:
        print("\n✅ Best Cointegrated Pairs:\n", best_pairs)
        best_pair = best_pairs.sort_values(by='Cointegration P-Value').iloc[0]

    return best_pair


def main(asset_class, sub_category, universe_size):
    tickers = fetch_equity_tickers(sub_category, universe_size) if asset_class == 'Equities' else fetch_manual_tickers(asset_class)
    print(f"Fetching data for {tickers}...")
    data = fetch_data(tickers)
    if data.empty:
        print("No valid data available.")
        return
    
    best_pair = identify_cointegrated_pairs(data)
    if best_pair is not None:
        print(f"Best Pair: {best_pair['Stock 1']} & {best_pair['Stock 2']}")
    else:
        print("No statistically significant pair found.")

if __name__ == "__main__":
    import sys, json
    user_input = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {"assetClass": "Equities", "subCategory": "Tech", "universeSize": 10}
    main(user_input['assetClass'], user_input['subCategory'], user_input['universeSize'])
