import yfinance as yf
import numpy as np
import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller
from scipy.stats import pearsonr
import json
import sys

def get_stock_data(tickers):
    """Fetch historical closing prices for the given tickers."""
    data = yf.download(tickers, period="1y", interval="1d")["Adj Close"]
    return data

def calculate_correlation(series1, series2):
    """Calculate Pearson correlation coefficient."""
    correlation, _ = pearsonr(series1, series2)
    return correlation

def cointegration_test(series1, series2):
    """Perform Engle-Granger cointegration test."""
    result = sm.OLS(series1, sm.add_constant(series2)).fit()
    p_value = adfuller(result.resid)[1]  # p-value from ADF test on residuals
    return p_value

def adf_test(series):
    """Perform Augmented Dickey-Fuller (ADF) test."""
    return adfuller(series)[1]  # p-value

def find_best_pair(tickers):
    """Find the best pair based on lowest p-value and highest correlation."""
    data = get_stock_data(tickers)
    best_pair = None
    best_p_value = 1  # Higher means no cointegration
    best_correlation = 0  # Higher is better

    results = []

    # Iterate through all pairs
    tickers = list(data.columns)
    for i in range(len(tickers)):
        for j in range(i + 1, len(tickers)):
            stock1, stock2 = tickers[i], tickers[j]
            series1, series2 = data[stock1], data[stock2]

            correlation = calculate_correlation(series1, series2)
            p_value = cointegration_test(series1, series2)
            adf1 = adf_test(series1)
            adf2 = adf_test(series2)

            results.append({
                "stock1": stock1, "stock2": stock2,
                "correlation": round(correlation, 4),
                "p_value": round(p_value, 4),
                "adf_stock1": round(adf1, 4),
                "adf_stock2": round(adf2, 4)
            })

            # Update best pair based on lowest p-value & highest correlation
            if p_value < best_p_value or (p_value == best_p_value and correlation > best_correlation):
                best_pair = (stock1, stock2)
                best_p_value = p_value
                best_correlation = correlation

    return {"best_pair": best_pair, "results": results}

if __name__ == "__main__":
    tickers = json.loads(sys.argv[1])  # Get tickers from Node.js API
    print(json.dumps(find_best_pair(tickers)))  # Return results
