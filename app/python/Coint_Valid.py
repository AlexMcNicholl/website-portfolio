import sys
import json
import yfinance as yf
import numpy as np
import pandas as pd
from statsmodels.tsa.stattools import coint, adfuller

def get_stock_data(ticker):
    """Fetch stock data and return adjusted closing prices (or regular close if missing)."""
    df = yf.download(ticker, period="5y", interval="1d")

    # Check if data is retrieved
    if df.empty:
        print(json.dumps({"error": f"Failed to fetch data for {ticker}"}))
        sys.exit(1)

    # Fix: Use 'Adj Close' if available, otherwise use 'Close'
    if "Adj Close" in df.columns:
        series = df["Adj Close"]
    elif "Close" in df.columns:
        series = df["Close"]
    else:
        print(json.dumps({"error": f"Missing both 'Adj Close' and 'Close' for {ticker}"}))
        sys.exit(1)

    # Ensure series has a valid index
    return series.dropna()

if len(sys.argv) < 3:
    print(json.dumps({"error": "Two stock tickers are required"}))
    sys.exit(1)

stock1, stock2 = sys.argv[1], sys.argv[2]

try:
    data1 = get_stock_data(stock1)
    data2 = get_stock_data(stock2)

    # Ensure indices align
    df = pd.concat([data1, data2], axis=1, join="inner").dropna()
    df.columns = [stock1, stock2]

    if df.empty:
        print(json.dumps({"error": "No overlapping data between stocks"}))
        sys.exit(1)

    # Perform Cointegration and ADF tests
    coint_t, p_value, _ = coint(df[stock1], df[stock2])
    adf_stock1 = adfuller(df[stock1])[1]
    adf_stock2 = adfuller(df[stock2])[1]

    results = {
        "stock1": stock1,
        "stock2": stock2,
        "coint_t": float(coint_t),
        "p_value": float(p_value),
        "adf_stock1": float(adf_stock1),
        "adf_stock2": float(adf_stock2),
    }

    print(json.dumps(results))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
