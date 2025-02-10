import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import coint

def get_stock_data(ticker):
    """Fetch stock data from Yahoo Finance"""
    df = yf.download(ticker, period="5y", interval="1d")
    if df.empty:
        raise ValueError(f"Error: Could not fetch data for {ticker}")
    return df['Adj Close']

def calculate_hedge_ratio(y, x):
    """Calculate the hedge ratio"""
    cov_matrix = np.cov(y, x)
    return cov_matrix[0, 1] / cov_matrix[1, 1]

def calculate_zscore(spread, window=30):
    """Calculate z-score"""
    rolling_mean = spread.rolling(window).mean()
    rolling_std = spread.rolling(window).std()
    return (spread - rolling_mean) / rolling_std

def pairs_trading_strategy(stock1, stock2):
    """Run the pairs trading strategy"""
    try:
        y = get_stock_data(stock1)
        x = get_stock_data(stock2)
    except ValueError as e:
        return str(e)

    df = pd.DataFrame({stock1: y, stock2: x}).dropna()
    hedge_ratio = calculate_hedge_ratio(df[stock1], df[stock2])
    spread = df[stock1] - hedge_ratio * df[stock2]
    zscore = calculate_zscore(spread)

    # Buy/Sell signals
    buy_signals = zscore[zscore < -1.5]
    sell_signals = zscore[zscore > 1.5]

    # Plot
    plt.figure(figsize=(12, 6))
    plt.plot(df.index, zscore, label="Z-Score")
    plt.axhline(-1.5, color='green', linestyle="--", label="Buy Signal")
    plt.axhline(1.5, color='red', linestyle="--", label="Sell Signal")
    plt.legend()
    plt.show()

    return {"hedge_ratio": hedge_ratio, "zscore": zscore.iloc[-1]}

if __name__ == "__main__":
    pairs_trading_strategy("AAPL", "MSFT")
